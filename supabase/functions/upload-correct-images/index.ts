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

    console.log('Starting upload of CORRECT images...');

    const results = [];

    // Correct product image mappings
    const correctProductImages = [
      {
        fileName: 'agua-horchata-correcta.jpg',
        productName: 'Agua de Horchata (400ml)',
        bucket: 'product-images'
      },
      {
        fileName: 'huevos-al-gusto-correcto.jpg',
        productName: 'Huevos al Gusto',
        bucket: 'product-images'
      },
      {
        fileName: 'enchiladas-verdes-correctas.jpg',
        productName: 'Enchiladas Verdes o Rojas',
        bucket: 'product-images'
      },
      {
        fileName: 'pozole-correcto.jpg',
        productName: 'Pozole Blanco, Rojo o Verde',
        bucket: 'product-images'
      },
      {
        fileName: 'tacos-correctos.jpg',
        productName: 'Taco de Pastor',
        bucket: 'product-images'
      },
      {
        fileName: 'flautas-correctas.jpg',
        productName: 'Flautas de Pollo, Carne, Papa',
        bucket: 'product-images'
      },
      {
        fileName: 'flan-correcto.jpg',
        productName: 'Flan',
        bucket: 'product-images'
      }
    ];

    // Correct category image mappings
    const correctCategoryImages = [
      {
        fileName: 'categoria-desayunos.jpg',
        categoryName: 'Desayunos',
        bucket: 'category-images'
      },
      {
        fileName: 'categoria-enchiladas.jpg',
        categoryName: 'Enchiladas',
        bucket: 'category-images'
      },
      {
        fileName: 'categoria-tacos-guisado.jpg',
        categoryName: 'Tacos de Guisado',
        bucket: 'category-images'
      },
      {
        fileName: 'categoria-pozole.jpg',
        categoryName: 'Pozole',
        bucket: 'category-images'
      },
      {
        fileName: 'categoria-tacos-parrilla.jpg',
        categoryName: 'Tacos a la Parrilla',
        bucket: 'category-images'
      },
      {
        fileName: 'categoria-flautas.jpg',
        categoryName: 'Flautas',
        bucket: 'category-images'
      },
      {
        fileName: 'categoria-postres.jpg',
        categoryName: 'Postres',
        bucket: 'category-images'
      }
    ];

    // Process product images
    for (const mapping of correctProductImages) {
      try {
        console.log(`Processing CORRECT product image: ${mapping.fileName} for ${mapping.productName}`);
        
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
          .upload(`correct-${mapping.fileName}`, imageData, {
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

    // Process category images
    for (const mapping of correctCategoryImages) {
      try {
        console.log(`Processing CORRECT category image: ${mapping.fileName} for ${mapping.categoryName}`);
        
        // Read the generated image file from public directory
        let imageData: Uint8Array;
        try {
          imageData = await Deno.readFile(`public/generated-images/${mapping.fileName}`);
        } catch (error) {
          console.log(`File not found: public/generated-images/${mapping.fileName}, skipping`);
          results.push({ name: mapping.fileName, category: mapping.categoryName, success: false, error: 'File not found' });
          continue;
        }

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(mapping.bucket)
          .upload(`correct-${mapping.fileName}`, imageData, {
            contentType: 'image/jpeg',
            upsert: true
          });

        if (uploadError) {
          console.error(`Upload error for ${mapping.fileName}:`, uploadError);
          results.push({ name: mapping.fileName, category: mapping.categoryName, success: false, error: uploadError.message });
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(mapping.bucket)
          .getPublicUrl(uploadData.path);

        const imageUrl = urlData.publicUrl;

        // Update category in database
        const { error: updateError } = await supabase
          .from('categories')
          .update({ image_url: imageUrl })
          .eq('name', mapping.categoryName);

        if (updateError) {
          console.error(`DB update error for ${mapping.categoryName}:`, updateError);
          results.push({ name: mapping.fileName, category: mapping.categoryName, success: false, error: updateError.message });
        } else {
          results.push({ name: mapping.fileName, category: mapping.categoryName, success: true, url: imageUrl });
          console.log(`Successfully processed: ${mapping.fileName} -> ${mapping.categoryName}`);
        }

      } catch (error) {
        console.error(`Error processing ${mapping.fileName}:`, error);
        results.push({ name: mapping.fileName, category: mapping.categoryName, success: false, error: error.message });
      }
    }

    console.log('CORRECT image upload process completed. Results:', results);

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    return new Response(JSON.stringify({ 
      success: true,
      results: results,
      message: `Successfully uploaded ${successCount} of ${totalCount} CORRECT images`,
      successCount,
      totalCount
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in upload-correct-images function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || 'Failed to upload correct images' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});