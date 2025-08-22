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

    console.log('Starting upload of menu product images...');

    const results = [];

    // Menu product image mappings
    const menuImageMappings = [
      // Desayunos
      {
        fileName: 'huevos-al-gusto.jpg',
        productName: 'Huevos al Gusto',
        bucket: 'product-images'
      },
      {
        fileName: 'huevos-mexicana.jpg',
        productName: 'Huevos a la Mexicana',
        bucket: 'product-images'
      },
      {
        fileName: 'huevos-divorciados.jpg',
        productName: 'Huevos Divorciados',
        bucket: 'product-images'
      },
      {
        fileName: 'omelette-espinaca-queso.jpg',
        productName: 'Omelette Espinaca y Queso',
        bucket: 'product-images'
      },
      {
        fileName: 'omelette-jamon-queso.jpg',
        productName: 'Omelette de Jamón y Queso',
        bucket: 'product-images'
      },
      {
        fileName: 'omelette-champinones-queso.jpg',
        productName: 'Omelette Queso y Champiñones',
        bucket: 'product-images'
      },
      {
        fileName: 'huevos-rancheros.jpg',
        productName: 'Huevos Rancheros',
        bucket: 'product-images'
      },
      
      // Enchiladas
      {
        fileName: 'enchiladas-verdes-rojas.jpg',
        productName: 'Enchiladas Verdes o Rojas',
        bucket: 'product-images'
      },
      {
        fileName: 'enchiladas-mole-poblano.jpg',
        productName: 'Enchiladas de Mole Poblano',
        bucket: 'product-images'
      },
      
      // Pozole
      {
        fileName: 'pozole-tradicional.jpg',
        productName: 'Pozole Blanco, Rojo o Verde',
        bucket: 'product-images'
      },
      {
        fileName: 'pollo-tlalpeno.jpg',
        productName: 'Pollo Tlalpeño',
        bucket: 'product-images'
      },
      
      // Tacos de Guisado
      {
        fileName: 'taco-chicharron-guisado.jpg',
        productName: 'Taco de Chicharrón Guisado',
        bucket: 'product-images'
      },
      
      // Tacos a la Parrilla
      {
        fileName: 'taco-pastor.jpg',
        productName: 'Taco de Pastor',
        bucket: 'product-images'
      },
      {
        fileName: 'taco-bistec-parrilla.jpg',
        productName: 'Taco de Bistec a la Parrilla',
        bucket: 'product-images'
      },
      {
        fileName: 'taco-suadero.jpg',
        productName: 'Taco de Suadero',
        bucket: 'product-images'
      },
      
      // Flautas
      {
        fileName: 'flautas-tradicionales.jpg',
        productName: 'Flautas de Pollo, Carne, Papa',
        bucket: 'product-images'
      },
      {
        fileName: 'flautas-ahogadas.jpg',
        productName: 'Flautas Ahogadas',
        bucket: 'product-images'
      },
      {
        fileName: 'quesadilla-grande.jpg',
        productName: 'Quesadilla Grande',
        bucket: 'product-images'
      },
      
      // Postres
      {
        fileName: 'flan-mexicano.jpg',
        productName: 'Flan',
        bucket: 'product-images'
      },
      {
        fileName: 'pastel-tres-leches.jpg',
        productName: 'Pastel',
        bucket: 'product-images'
      }
    ];

    // Process all menu images
    for (const mapping of menuImageMappings) {
      try {
        console.log(`Processing menu image: ${mapping.fileName} for ${mapping.productName}`);
        
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

    console.log('Menu image upload process completed. Results:', results);

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    return new Response(JSON.stringify({ 
      success: true,
      results: results,
      message: `Successfully uploaded ${successCount} of ${totalCount} menu images`,
      successCount,
      totalCount
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in upload-menu-images function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || 'Failed to upload menu images' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});