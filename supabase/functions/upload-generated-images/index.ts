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

    console.log('Starting image upload process...');

    const results = [];

    // Product image mappings (what we generated vs what exists in DB)
    const productImageMappings = [
      {
        dbName: 'Agua de Jamaica (400ml)',
        localPath: '/src/assets/products/agua-jamaica.jpg',
        generatedPath: 'src/assets/products/agua-jamaica-real.jpg',
        targetName: 'agua-jamaica.jpg'
      },
      {
        dbName: 'Arroz con dos huevos', // This will cover all rice products
        localPath: '/src/assets/products/arroz-mexicano.jpg',
        generatedPath: 'src/assets/products/arroz-mexicano-real.jpg',
        targetName: 'arroz-mexicano.jpg'
      },
      {
        dbName: 'Barbacoa de Res',
        localPath: '/src/assets/products/barbacoa-res.jpg',
        generatedPath: 'src/assets/products/barbacoa-res-real.jpg',
        targetName: 'barbacoa-res.jpg'
      },
      {
        dbName: 'Bistec Asado',
        localPath: '/src/assets/products/bistec-asado.jpg',
        generatedPath: 'src/assets/products/bistec-asado-real.jpg',
        targetName: 'bistec-asado.jpg'
      },
      {
        dbName: 'Café Americano / Capuccino',
        localPath: '/src/assets/products/cafe-olla.jpg',
        generatedPath: 'src/assets/products/cafe-olla-real.jpg',
        targetName: 'cafe-olla.jpg'
      }
    ];

    // Category image mappings
    const categoryImageMappings = [
      {
        dbName: 'Bebidas',
        localPath: '/src/assets/categories/bebidas.jpg',
        generatedPath: 'src/assets/categories/bebidas-real.jpg',
        targetName: 'category-bebidas.jpg'
      },
      {
        dbName: 'Bebidas con Alcohol',
        localPath: '/src/assets/categories/bebidas-alcohol.jpg',
        generatedPath: 'src/assets/categories/bebidas-alcohol-real.jpg',
        targetName: 'category-bebidas-alcohol.jpg'
      },
      {
        dbName: 'Chilaquiles',
        localPath: '/src/assets/categories/chilaquiles.jpg',
        generatedPath: 'src/assets/categories/chilaquiles-real.jpg',
        targetName: 'category-chilaquiles.jpg'
      },
      {
        dbName: 'Especialidades',
        localPath: '/src/assets/categories/especialidades.jpg',
        generatedPath: 'src/assets/categories/especialidades-real.jpg',
        targetName: 'category-especialidades.jpg'
      },
      {
        dbName: 'Tequilas y Mezcal',
        localPath: '/src/assets/categories/tequilas-mezcal.jpg',
        generatedPath: 'src/assets/categories/tequilas-mezcal-real.jpg',
        targetName: 'category-tequilas-mezcal.jpg'
      }
    ];

    // Process products
    for (const mapping of productImageMappings) {
      try {
        console.log(`Processing product: ${mapping.dbName}`);
        
        // Read the generated image file
        let imageData: Uint8Array;
        try {
          imageData = await Deno.readFile(mapping.generatedPath);
        } catch (error) {
          console.log(`File not found: ${mapping.generatedPath}, skipping`);
          continue;
        }

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(mapping.targetName, imageData, {
            contentType: 'image/jpeg',
            upsert: true
          });

        if (uploadError) {
          console.error(`Upload error for ${mapping.targetName}:`, uploadError);
          results.push({ name: mapping.dbName, success: false, error: uploadError.message });
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(uploadData.path);

        const imageUrl = urlData.publicUrl;

        // Update products in database
        if (mapping.dbName === 'Arroz con dos huevos') {
          // Update all rice products
          const { error: updateError } = await supabase
            .from('products')
            .update({ image_url: imageUrl })
            .eq('image_url', mapping.localPath);
          
          if (updateError) {
            console.error(`DB update error for rice products:`, updateError);
            results.push({ name: 'Rice products', success: false, error: updateError.message });
          } else {
            results.push({ name: 'Rice products', success: true, url: imageUrl });
          }
        } else {
          // Update specific product
          const { error: updateError } = await supabase
            .from('products')
            .update({ image_url: imageUrl })
            .eq('name', mapping.dbName);

          if (updateError) {
            console.error(`DB update error for ${mapping.dbName}:`, updateError);
            results.push({ name: mapping.dbName, success: false, error: updateError.message });
          } else {
            results.push({ name: mapping.dbName, success: true, url: imageUrl });
          }
        }

        console.log(`Successfully processed: ${mapping.dbName}`);

      } catch (error) {
        console.error(`Error processing ${mapping.dbName}:`, error);
        results.push({ name: mapping.dbName, success: false, error: error.message });
      }
    }

    // Process categories
    for (const mapping of categoryImageMappings) {
      try {
        console.log(`Processing category: ${mapping.dbName}`);
        
        // Read the generated image file
        let imageData: Uint8Array;
        try {
          imageData = await Deno.readFile(mapping.generatedPath);
        } catch (error) {
          console.log(`File not found: ${mapping.generatedPath}, skipping`);
          continue;
        }

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('category-images')
          .upload(mapping.targetName, imageData, {
            contentType: 'image/jpeg',
            upsert: true
          });

        if (uploadError) {
          console.error(`Upload error for ${mapping.targetName}:`, uploadError);
          results.push({ name: mapping.dbName, success: false, error: uploadError.message });
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('category-images')
          .getPublicUrl(uploadData.path);

        const imageUrl = urlData.publicUrl;

        // Update category in database
        const { error: updateError } = await supabase
          .from('categories')
          .update({ image_url: imageUrl })
          .eq('name', mapping.dbName);

        if (updateError) {
          console.error(`DB update error for ${mapping.dbName}:`, updateError);
          results.push({ name: mapping.dbName, success: false, error: updateError.message });
        } else {
          results.push({ name: mapping.dbName, success: true, url: imageUrl });
        }

        console.log(`Successfully processed category: ${mapping.dbName}`);

      } catch (error) {
        console.error(`Error processing category ${mapping.dbName}:`, error);
        results.push({ name: mapping.dbName, success: false, error: error.message });
      }
    }

    console.log('Upload process completed. Results:', results);

    return new Response(JSON.stringify({ 
      success: true,
      results: results,
      message: `Processed ${results.length} images`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in upload-generated-images function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || 'Failed to upload images' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});