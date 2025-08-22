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

    console.log('Starting complete image generation and upload process...');

    const results = [];

    // Generate and upload product images
    const productImages = [
      {
        name: 'Agua de Jamaica',
        prompt: 'Refreshing agua de jamaica (hibiscus water) in a tall glass with ice, traditional Mexican drink, restaurant presentation, natural lighting, high quality, ultra realistic food photography',
        dbName: 'Agua de Jamaica (400ml)',
        fileName: 'agua-jamaica.jpg'
      },
      {
        name: 'Arroz Mexicano',
        prompt: 'Traditional Mexican rice (arroz mexicano) with vegetables, served on ceramic plate, restaurant presentation, natural lighting, authentic Mexican food photography',
        dbName: 'arroz', // This will match multiple products
        fileName: 'arroz-mexicano.jpg'
      },
      {
        name: 'Barbacoa de Res',
        prompt: 'Delicious barbacoa de res (beef barbacoa) served with rice, beans and guacamole, traditional Mexican dish, restaurant plating, professional food photography',
        dbName: 'Barbacoa de Res',
        fileName: 'barbacoa-res.jpg'
      },
      {
        name: 'Bistec Asado',
        prompt: 'Grilled bistec asado (grilled beef steak) with beans, lettuce and tomato salad, Mexican cuisine, restaurant presentation, natural lighting',
        dbName: 'Bistec Asado',
        fileName: 'bistec-asado.jpg'
      },
      {
        name: 'Café',
        prompt: 'Traditional Mexican café de olla (clay pot coffee) in rustic clay mug, steam rising, authentic presentation, warm lighting, coffee photography',
        dbName: 'Café Americano / Capuccino',
        fileName: 'cafe-olla.jpg'
      }
    ];

    // Generate and upload category images
    const categoryImages = [
      {
        name: 'Bebidas',
        prompt: 'Traditional Mexican beverages collection: agua fresca, café de olla, and traditional drinks, restaurant beverage category display, professional photography',
        fileName: 'category-bebidas.jpg'
      },
      {
        name: 'Bebidas con Alcohol',
        prompt: 'Mexican alcoholic beverages: beer, margarita cocktails, and alcoholic drinks collection, bar setting, professional beverage photography',
        fileName: 'category-bebidas-alcohol.jpg'
      },
      {
        name: 'Chilaquiles',
        prompt: 'Delicious Mexican chilaquiles with green sauce, cheese, onion and cream, traditional breakfast dish, restaurant presentation, authentic Mexican food',
        fileName: 'category-chilaquiles.jpg'
      },
      {
        name: 'Especialidades',
        prompt: 'Mexican specialty dishes collection: mole, tacos, traditional specialties platter, restaurant presentation, authentic Mexican cuisine photography',
        fileName: 'category-especialidades.jpg'
      },
      {
        name: 'Tequilas y Mezcal',
        prompt: 'Premium tequila and mezcal collection: bottles displayed with shot glasses, traditional Mexican spirits, bar photography, professional lighting',
        fileName: 'category-tequilas-mezcal.jpg'
      }
    ];

    // Process products
    for (const product of productImages) {
      try {
        console.log(`Generating image for product: ${product.name}`);

        // Generate image using native Lovable tools
        const imageResponse = await fetch('https://api.lovable.app/v1/images/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: product.prompt,
            width: 1024,
            height: 1024,
            model: 'flux.dev'
          }),
        });

        if (!imageResponse.ok) {
          throw new Error(`Failed to generate image: ${imageResponse.status}`);
        }

        const imageBlob = await imageResponse.blob();
        const imageArrayBuffer = await imageBlob.arrayBuffer();
        const imageBuffer = new Uint8Array(imageArrayBuffer);

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(product.fileName, imageBuffer, {
            contentType: 'image/jpeg',
            upsert: true
          });

        if (uploadError) {
          console.error(`Upload error for ${product.fileName}:`, uploadError);
          results.push({ name: product.name, success: false, error: uploadError.message });
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(uploadData.path);

        const imageUrl = urlData.publicUrl;

        // Update products in database
        if (product.dbName === 'arroz') {
          // Update all rice products
          const { error: updateError } = await supabase
            .from('products')
            .update({ image_url: imageUrl })
            .ilike('name', '%arroz%');
          
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
            .eq('name', product.dbName);

          if (updateError) {
            console.error(`DB update error for ${product.dbName}:`, updateError);
            results.push({ name: product.dbName, success: false, error: updateError.message });
          } else {
            results.push({ name: product.dbName, success: true, url: imageUrl });
          }
        }

        console.log(`Successfully processed: ${product.name}`);

      } catch (error) {
        console.error(`Error processing ${product.name}:`, error);
        results.push({ name: product.name, success: false, error: error.message });
      }
    }

    // Process categories
    for (const category of categoryImages) {
      try {
        console.log(`Generating image for category: ${category.name}`);

        // Generate image using native Lovable tools
        const imageResponse = await fetch('https://api.lovable.app/v1/images/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: category.prompt,
            width: 1024,
            height: 1024,
            model: 'flux.dev'
          }),
        });

        if (!imageResponse.ok) {
          throw new Error(`Failed to generate image: ${imageResponse.status}`);
        }

        const imageBlob = await imageResponse.blob();
        const imageArrayBuffer = await imageBlob.arrayBuffer();
        const imageBuffer = new Uint8Array(imageArrayBuffer);

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('category-images')
          .upload(category.fileName, imageBuffer, {
            contentType: 'image/jpeg',
            upsert: true
          });

        if (uploadError) {
          console.error(`Upload error for ${category.fileName}:`, uploadError);
          results.push({ name: category.name, success: false, error: uploadError.message });
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
          .eq('name', category.name);

        if (updateError) {
          console.error(`DB update error for ${category.name}:`, updateError);
          results.push({ name: category.name, success: false, error: updateError.message });
        } else {
          results.push({ name: category.name, success: true, url: imageUrl });
        }

        console.log(`Successfully processed category: ${category.name}`);

      } catch (error) {
        console.error(`Error processing category ${category.name}:`, error);
        results.push({ name: category.name, success: false, error: error.message });
      }
    }

    console.log('Complete image generation and upload process finished. Results:', results);

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    return new Response(JSON.stringify({ 
      success: true,
      results: results,
      message: `Successfully processed ${successCount} of ${totalCount} images`,
      successCount,
      totalCount
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-and-upload-all-images function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || 'Failed to generate and upload images' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});