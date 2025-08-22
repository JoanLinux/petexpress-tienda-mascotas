import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, productName = 'producto' } = await req.json();
    
    console.log('Generating image for:', prompt);

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate image with OpenAI
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'hd',
        response_format: 'url'
      }),
    });

    if (!imageResponse.ok) {
      const errorData = await imageResponse.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${imageResponse.status}`);
    }

    const imageData = await imageResponse.json();
    const imageUrl = imageData.data[0]?.url;

    if (!imageUrl) {
      throw new Error('No image URL received from OpenAI');
    }

    console.log('Image generated:', imageUrl);

    // Download the image
    const imageDownloadResponse = await fetch(imageUrl);
    if (!imageDownloadResponse.ok) {
      throw new Error('Failed to download generated image');
    }

    const imageArrayBuffer = await imageDownloadResponse.arrayBuffer();
    const imageBuffer = new Uint8Array(imageArrayBuffer);

    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `ai-generated-${productName.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.jpg`;
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filename, imageBuffer, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    console.log('Image uploaded:', uploadData.path);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(uploadData.path);

    const finalImageUrl = urlData.publicUrl;

    console.log('Final image URL:', finalImageUrl);

    return new Response(JSON.stringify({ 
      imageUrl: finalImageUrl,
      filename: uploadData.path
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-product-image function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate image' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});