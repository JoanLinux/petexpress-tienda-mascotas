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

    console.log('Starting upload of generated images...');

    const results = [];

    // Product image mappings
    const productImages = [
      {
        fileName: 'agua-jamaica.jpg',
        dbName: 'Agua de Jamaica (400ml)',
        bucket: 'product-images'
      },
      {
        fileName: 'arroz-mexicano.jpg',
        dbNames: ['arroz'], // This will match multiple products using ILIKE
        bucket: 'product-images'
      },
      {
        fileName: 'barbacoa-res.jpg',
        dbName: 'Barbacoa de Res',
        bucket: 'product-images'
      },
      {
        fileName: 'bistec-asado.jpg',
        dbName: 'Bistec Asado',
        bucket: 'product-images'
      },
      {
        fileName: 'cafe-olla.jpg',
        dbName: 'Café Americano / Capuccino',
        bucket: 'product-images'
      }
    ];

    // Category image mappings
    const categoryImages = [
      {
        fileName: 'category-bebidas.jpg',
        dbName: 'Bebidas',
        bucket: 'category-images'
      },
      {
        fileName: 'category-bebidas-alcohol.jpg',
        dbName: 'Bebidas con Alcohol',
        bucket: 'category-images'
      },
      {
        fileName: 'category-chilaquiles.jpg',
        dbName: 'Chilaquiles',
        bucket: 'category-images'
      },
      {
        fileName: 'category-especialidades.jpg',
        dbName: 'Especialidades',
        bucket: 'category-images'
      },
      {
        fileName: 'category-tequilas-mezcal.jpg',
        dbName: 'Tequilas y Mezcal',
        bucket: 'category-images'
      }
    ];

    // Process products
    for (const product of productImages) {
      try {
        console.log(`Processing product image: ${product.fileName}`);
        
        // Read the generated image file from public directory
        let imageData: Uint8Array;
        try {
          imageData = await Deno.readFile(`public/generated-images/${product.fileName}`);
        } catch (error) {
          console.log(`File not found: public/generated-images/${product.fileName}, skipping`);
          results.push({ name: product.fileName, success: false, error: 'File not found' });
          continue;
        }

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(product.bucket)
          .upload(product.fileName, imageData, {
            contentType: 'image/jpeg',
            upsert: true
          });

        if (uploadError) {
          console.error(`Upload error for ${product.fileName}:`, uploadError);
          results.push({ name: product.fileName, success: false, error: uploadError.message });
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(product.bucket)
          .getPublicUrl(uploadData.path);

        const imageUrl = urlData.publicUrl;

        // Update products in database
        if (product.dbNames) {
          // Update all products that match any of the names
          for (const dbName of product.dbNames) {
            const { error: updateError } = await supabase
              .from('products')
              .update({ image_url: imageUrl })
              .ilike('name', `%${dbName}%`);
            
            if (updateError) {
              console.error(`DB update error for products with ${dbName}:`, updateError);
            } else {
              console.log(`Updated products containing: ${dbName}`);
            }
          }
          results.push({ name: `Products with ${product.dbNames.join(', ')}`, success: true, url: imageUrl });
        } else if (product.dbName) {
          // Update specific product
          const { error: updateError } = await supabase
            .from('products')
            .update({ image_url: imageUrl })
            .eq('name', product.dbName);

          if (updateError) {
            console.error(`DB update error for ${product.dbName}:`, updateError);
            results.push({ name: product.dbName, success: false, error: updateError.message });
          } else {
            results.push({ name: product.dbName, success: true, url: imageUrl });
          }
        }

        console.log(`Successfully processed: ${product.fileName}`);

      } catch (error) {
        console.error(`Error processing ${product.fileName}:`, error);
        results.push({ name: product.fileName, success: false, error: error.message });
      }
    }

    // Process categories
    for (const category of categoryImages) {
      try {
        console.log(`Processing category image: ${category.fileName}`);
        
        // Read the generated image file from public directory
        let imageData: Uint8Array;
        try {
          imageData = await Deno.readFile(`public/generated-images/${category.fileName}`);
        } catch (error) {
          console.log(`File not found: public/generated-images/${category.fileName}, skipping`);
          results.push({ name: category.fileName, success: false, error: 'File not found' });
          continue;
        }

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(category.bucket)
          .upload(category.fileName, imageData, {
            contentType: 'image/jpeg',
            upsert: true
          });

        if (uploadError) {
          console.error(`Upload error for ${category.fileName}:`, uploadError);
          results.push({ name: category.fileName, success: false, error: uploadError.message });
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(category.bucket)
          .getPublicUrl(uploadData.path);

        const imageUrl = urlData.publicUrl;

        // Update category in database
        const { error: updateError } = await supabase
          .from('categories')
          .update({ image_url: imageUrl })
          .eq('name', category.dbName);

        if (updateError) {
          console.error(`DB update error for ${category.dbName}:`, updateError);
          results.push({ name: category.dbName, success: false, error: updateError.message });
        } else {
          results.push({ name: category.dbName, success: true, url: imageUrl });
        }

        console.log(`Successfully processed category: ${category.fileName}`);

      } catch (error) {
        console.error(`Error processing category ${category.fileName}:`, error);
        results.push({ name: category.fileName, success: false, error: error.message });
      }
    }

    console.log('Upload process completed. Results:', results);

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    return new Response(JSON.stringify({ 
      success: true,
      results: results,
      message: `Successfully uploaded ${successCount} of ${totalCount} images`,
      successCount,
      totalCount
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in upload-generated-images-final function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || 'Failed to upload images' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});