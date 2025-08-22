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
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting upload of all product images...');

    const results = [];

    // Product image mappings with new generated images
    const productImageMappings = [
      {
        fileName: 'agua-horchata.jpg',
        productName: 'Agua de Horchata (400ml)',
        bucket: 'product-images'
      },
      {
        fileName: 'agua-jamaica-new.jpg',
        productName: 'Agua de Jamaica (400ml)',
        bucket: 'product-images'
      },
      {
        fileName: 'agua-embotellada.jpg',
        productName: 'Agua Embotellada (500 ml)',
        bucket: 'product-images'
      },
      {
        fileName: 'arroz-dos-huevos.jpg',
        productName: 'Arroz con dos huevos',
        bucket: 'product-images'
      },
      {
        fileName: 'arroz-mole.jpg',
        productName: 'Arroz con mole',
        bucket: 'product-images'
      },
      {
        fileName: 'arroz-un-huevo.jpg',
        productName: 'Arroz con un huevo',
        bucket: 'product-images'
      },
      {
        fileName: 'arroz-solo.jpg',
        productName: 'Arroz Solo',
        bucket: 'product-images'
      },
      {
        fileName: 'barbacoa-res-new.jpg',
        productName: 'Barbacoa de Res',
        bucket: 'product-images'
      },
      {
        fileName: 'bistec-asado-new.jpg',
        productName: 'Bistec Asado',
        bucket: 'product-images'
      },
      {
        fileName: 'cafe-americano-cappuccino.jpg',
        productName: 'Café Americano / Capuccino',
        bucket: 'product-images'
      },
      {
        fileName: 'cafe-leche-olla.jpg',
        productName: 'Café con Leche / de olla',
        bucket: 'product-images'
      },
      {
        fileName: 'cantarito-new.jpg',
        productName: 'Cantarito',
        bucket: 'product-images'
      },
      {
        fileName: 'carnitas-casa-new.jpg',
        productName: 'Carnitas de la casa (300 gr)',
        bucket: 'product-images'
      },
      {
        fileName: 'cecina-natural-new.jpg',
        productName: 'Cecina Natural',
        bucket: 'product-images'
      },
      {
        fileName: 'cerveza-new.jpg',
        productName: 'Cerveza (355 ml)',
        bucket: 'product-images'
      },
      {
        fileName: 'cerveza-clamato.jpg',
        productName: 'Cerveza Con Clamato',
        bucket: 'product-images'
      },
      {
        fileName: 'stella-artois.jpg',
        productName: 'Cerveza Stella Artois',
        bucket: 'product-images'
      },
      {
        fileName: 'chilaquiles-tradicionales-new.jpg',
        productName: 'Chilaquiles Tradicionales',
        bucket: 'product-images'
      },
      {
        fileName: 'clamato-preparado.jpg',
        productName: 'Clamato Preparado',
        bucket: 'product-images'
      },
      {
        fileName: 'ensalada-nopales-new.jpg',
        productName: 'Ensalada de Nopales',
        bucket: 'product-images'
      }
    ];

    // Process all product images
    for (const mapping of productImageMappings) {
      try {
        console.log(`Processing product image: ${mapping.fileName} for ${mapping.productName}`);
        
        // Read the generated image file from public directory
        let imageData: Uint8Array;
        try {
          imageData = await Deno.readFile(`public/generated-images/${mapping.fileName}`);
        } catch (error) {
          console.log(`File not found: public/generated-images/${mapping.fileName}, skipping`);
          results.push({ name: mapping.fileName, product: mapping.productName, success: false, error: 'File not found' });
          continue;
        }

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(mapping.bucket)
          .upload(mapping.fileName, imageData, {
            contentType: 'image/jpeg',
            upsert: true
          });

        if (uploadError) {
          console.error(`Upload error for ${mapping.fileName}:`, uploadError);
          results.push({ name: mapping.fileName, product: mapping.productName, success: false, error: uploadError.message });
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(mapping.bucket)
          .getPublicUrl(uploadData.path);

        const imageUrl = urlData.publicUrl;

        // Update product in database
        const { error: updateError } = await supabase
          .from('products')
          .update({ image_url: imageUrl })
          .eq('name', mapping.productName);

        if (updateError) {
          console.error(`DB update error for ${mapping.productName}:`, updateError);
          results.push({ name: mapping.fileName, product: mapping.productName, success: false, error: updateError.message });
        } else {
          results.push({ name: mapping.fileName, product: mapping.productName, success: true, url: imageUrl });
          console.log(`Successfully processed: ${mapping.fileName} -> ${mapping.productName}`);
        }

      } catch (error) {
        console.error(`Error processing ${mapping.fileName}:`, error);
        results.push({ name: mapping.fileName, product: mapping.productName, success: false, error: error.message });
      }
    }

    console.log('Product image upload process completed. Results:', results);

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    return new Response(JSON.stringify({ 
      success: true,
      results: results,
      message: `Successfully uploaded ${successCount} of ${totalCount} product images`,
      successCount,
      totalCount
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in upload-all-product-images function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || 'Failed to upload product images' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});