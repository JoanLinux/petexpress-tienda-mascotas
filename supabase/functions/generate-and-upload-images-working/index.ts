import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openaiKey = Deno.env.get('OPENAI_API_KEY');

    if (!supabaseUrl || !supabaseServiceKey || !openaiKey) {
      throw new Error('Missing environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting image generation and upload...');

    const results = [];

    // Imagen de comida mexicana simple pero específica
    const imagePrompts = [
      {
        prompt: "A traditional Mexican dish - water of horchata, creamy white rice drink in a glass with cinnamon, food photography, no people, no animals",
        productName: "Agua de Horchata (400ml)",
        fileName: "agua-horchata-working.jpg"
      },
      {
        prompt: "Mexican breakfast plate with scrambled eggs, refried beans and chilaquiles on ceramic plate, food photography, no people, no animals", 
        productName: "Huevos al Gusto",
        fileName: "huevos-working.jpg"
      },
      {
        prompt: "Green enchiladas with chicken covered in green sauce and white crema, Mexican food photography, no people, no animals",
        productName: "Enchiladas Verdes o Rojas", 
        fileName: "enchiladas-working.jpg"
      }
    ];

    for (const item of imagePrompts) {
      try {
        console.log(`Generating image: ${item.fileName}`);

        // Generar imagen con OpenAI
        const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: item.prompt,
            n: 1,
            size: '1024x1024',
            quality: 'standard'
          })
        });

        if (!imageResponse.ok) {
          throw new Error(`OpenAI API error: ${imageResponse.status}`);
        }

        const imageData = await imageResponse.json();
        const imageUrl = imageData.data[0].url;
        
        console.log(`Generated image URL: ${imageUrl}`);

        // Descargar la imagen generada
        const downloadResponse = await fetch(imageUrl);
        if (!downloadResponse.ok) {
          throw new Error(`Failed to download image: ${downloadResponse.status}`);
        }

        const imageBuffer = await downloadResponse.arrayBuffer();
        console.log(`Downloaded image, size: ${imageBuffer.byteLength} bytes`);

        // Subir a Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(item.fileName, imageBuffer, {
            contentType: 'image/jpeg',
            upsert: true
          });

        if (uploadError) {
          throw new Error(`Upload error: ${uploadError.message}`);
        }

        console.log(`Uploaded to storage: ${uploadData.path}`);

        // Obtener URL pública
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(uploadData.path);

        const publicUrl = urlData.publicUrl;
        console.log(`Public URL: ${publicUrl}`);

        // Actualizar producto en base de datos
        const { error: updateError } = await supabase
          .from('products')
          .update({ image_url: publicUrl })
          .eq('name', item.productName);

        if (updateError) {
          console.error(`DB update error: ${updateError.message}`);
          results.push({ 
            name: item.fileName, 
            product: item.productName, 
            success: false, 
            error: updateError.message 
          });
        } else {
          results.push({ 
            name: item.fileName, 
            product: item.productName, 
            success: true, 
            url: publicUrl 
          });
          console.log(`SUCCESS: ${item.fileName} -> ${item.productName}`);
        }

      } catch (error) {
        console.error(`Error processing ${item.fileName}:`, error);
        results.push({ 
          name: item.fileName, 
          product: item.productName, 
          success: false, 
          error: error.message 
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    console.log(`Completed: ${successCount}/${totalCount} successful`);

    return new Response(JSON.stringify({ 
      success: successCount > 0,
      results: results,
      message: `Generated and uploaded ${successCount} of ${totalCount} images`,
      successCount,
      totalCount
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});