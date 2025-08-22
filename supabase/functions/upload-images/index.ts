import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY no está configurado');
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials no están configurados');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Definir todas las imágenes que necesitamos generar
    const imageDefinitions = [
      // Categorías
      {
        type: 'category',
        name: 'especialidades',
        prompt: 'Traditional Mexican specialties plate with tampiqueña, mole dishes, carnitas, and traditional Mexican garnishes on rustic wooden table, authentic Mexican restaurant food photography, warm lighting, square aspect ratio',
        bucket: 'category-images'
      },
      {
        type: 'category', 
        name: 'chilaquiles',
        prompt: 'Delicious Mexican chilaquiles with green salsa, fried egg, crema, queso fresco, and avocado slices on traditional Mexican plate, overhead view, square aspect ratio, professional food photography',
        bucket: 'category-images'
      },
      {
        type: 'category',
        name: 'bebidas',
        prompt: 'Traditional Mexican fresh waters (aguas frescas) in glass pitchers - horchata, jamaica, tamarindo, and lime water with colorful straws, Mexican restaurant beverage display, square aspect ratio',
        bucket: 'category-images'
      },
      {
        type: 'category',
        name: 'bebidas-alcohol',
        prompt: 'Mexican cocktails including margaritas, palomas, and micheladas with lime garnishes, colorful drinks on rustic wooden bar, Mexican restaurant bar setup, square aspect ratio',
        bucket: 'category-images'
      },
      {
        type: 'category',
        name: 'tequilas-mezcal',
        prompt: 'Premium tequila and mezcal bottles arranged on wooden shelf, traditional Mexican spirits collection, agave plant in background, authentic Mexican bar display, square aspect ratio',
        bucket: 'category-images'
      },

      // Productos - Especialidades
      {
        type: 'product',
        name: 'bistec-asado',
        prompt: 'Grilled Mexican bistec asado (grilled steak) with refried beans, lettuce and tomato salad, served on traditional Mexican ceramic plate, professional food photography, warm lighting',
        bucket: 'product-images'
      },
      {
        type: 'product',
        name: 'tampiquena',
        prompt: 'Traditional Mexican tampiqueña with grilled beef, mole enchilada, Mexican rice, guacamole, and refried beans on rustic wooden table, authentic Mexican cuisine photography',
        bucket: 'product-images'
      },
      {
        type: 'product',
        name: 'pollo-mole-verde',
        prompt: 'Mexican chicken thigh and leg in green mole sauce (mole verde) with Mexican rice and black beans, traditional ceramic plate, professional Mexican food photography',
        bucket: 'product-images'
      },
      {
        type: 'product',
        name: 'pechuga-mole-poblano',
        prompt: 'Grilled chicken breast covered in rich mole poblano sauce with Mexican rice and beans, garnished with sesame seeds, traditional Mexican presentation',
        bucket: 'product-images'
      },
      {
        type: 'product',
        name: 'barbacoa-res',
        prompt: 'Traditional Mexican barbacoa de res (beef barbacoa) with Mexican rice, refried beans, fresh guacamole, and corn tortillas, served on traditional clay plate',
        bucket: 'product-images'
      },
      {
        type: 'product',
        name: 'carnitas-casa',
        prompt: 'Mexican carnitas (slow-cooked pork) with refried beans, crispy chicharrón, fresh guacamole, and warm corn tortillas, rustic wooden presentation',
        bucket: 'product-images'
      },
      {
        type: 'product',
        name: 'cecina-natural',
        prompt: 'Grilled cecina (Mexican dried salted beef) with nopales (cactus paddles) and refried beans, traditional Mexican dish on ceramic plate',
        bucket: 'product-images'
      },
      {
        type: 'product',
        name: 'ensalada-nopales',
        prompt: 'Fresh Mexican nopales salad with tomatoes, onions, cilantro, and queso fresco, dressed with lime and olive oil, colorful healthy Mexican salad',
        bucket: 'product-images'
      },
      {
        type: 'product',
        name: 'plato-botanero',
        prompt: 'Mexican plato botanero with 3 sopes with chorizo, 3 beef taquitos, and 3 cheese quesadillitas, variety appetizer platter on wooden board',
        bucket: 'product-images'
      },
      {
        type: 'product',
        name: 'arroz-mexicano',
        prompt: 'Traditional Mexican red rice (arroz rojo) in white ceramic bowl, garnished with peas and carrots, side dish presentation',
        bucket: 'product-images'
      },

      // Chilaquiles
      {
        type: 'product',
        name: 'chilaquiles-tradicionales',
        prompt: 'Traditional Mexican chilaquiles with green salsa, fried egg, Mexican crema, queso fresco, avocado, and onion rings, served on colorful ceramic plate',
        bucket: 'product-images'
      },

      // Bebidas sin alcohol
      {
        type: 'product',
        name: 'agua-jamaica',
        prompt: 'Fresh agua de jamaica (hibiscus water) in glass pitcher with ice and lime garnish, traditional Mexican refreshing drink, ruby red color',
        bucket: 'product-images'
      },
      {
        type: 'product',
        name: 'agua-horchata',
        prompt: 'Creamy horchata (rice and cinnamon drink) in glass with cinnamon stick, traditional Mexican beverage, white creamy texture with cinnamon dusting on top',
        bucket: 'product-images'
      },
      {
        type: 'product',
        name: 'cafe-olla',
        prompt: 'Mexican café de olla in traditional clay cup with cinnamon stick, steaming hot coffee with cinnamon and piloncillo, rustic wooden table',
        bucket: 'product-images'
      },
      {
        type: 'product',
        name: 'jugo-naranja',
        prompt: 'Fresh orange juice in glass with orange slice garnish, vibrant orange color, Mexican restaurant beverage presentation',
        bucket: 'product-images'
      },
      {
        type: 'product',
        name: 'tepache',
        prompt: 'Traditional Mexican tepache (fermented pineapple drink) in glass with chili rim, pineapple and cinnamon garnish, golden amber color',
        bucket: 'product-images'
      },
      {
        type: 'product',
        name: 'limonada',
        prompt: 'Fresh limonada (lime water) in glass pitcher with lime slices and mint, refreshing green-tinted beverage, Mexican restaurant style',
        bucket: 'product-images'
      },

      // Bebidas con alcohol
      {
        type: 'product',
        name: 'cerveza',
        prompt: 'Classic Mexican beer (cerveza) bottle with lime wedge and salt rim glass, cold condensation, Mexican bar setting',
        bucket: 'product-images'
      },
      {
        type: 'product',
        name: 'margarita',
        prompt: 'Mexican margarita cocktail with salted rim, lime garnish, in traditional margarita glass, professional bar presentation with tequila bottle background',
        bucket: 'product-images'
      },
      {
        type: 'product',
        name: 'mezcalita',
        prompt: 'Mezcalita cocktail with smoky mezcal, lime juice, and chili rim in glass, garnished with orange wheel and salt, Mexican bar presentation',
        bucket: 'product-images'
      },
      {
        type: 'product',
        name: 'paloma',
        prompt: 'Mexican paloma cocktail with tequila and grapefruit in tall glass with salt rim, garnished with lime and grapefruit wedge, refreshing pink drink',
        bucket: 'product-images'
      },
      {
        type: 'product',
        name: 'mojito',
        prompt: 'Classic mojito cocktail with fresh mint, lime, and white rum in highball glass, Cuban-style drink in Mexican restaurant setting',
        bucket: 'product-images'
      },
      {
        type: 'product',
        name: 'cantarito',
        prompt: 'Traditional Mexican cantarito cocktail in clay cup with tequila, citrus juices, and grapefruit soda, garnished with lime and orange',
        bucket: 'product-images'
      },
      {
        type: 'product',
        name: 'sangria',
        prompt: 'Spanish sangria with red wine and fresh fruits in glass pitcher, garnished with orange, apple, and berries, Mexican restaurant presentation',
        bucket: 'product-images'
      },

      // Tequilas y mezcal
      {
        type: 'product',
        name: 'tequila-blanco',
        prompt: 'Two shot glasses of premium silver tequila with lime wedges and salt, Mexican bar setup with agave plant in background',
        bucket: 'product-images'
      },
      {
        type: 'product',
        name: 'mezcal',
        prompt: 'Two shot glasses of artisanal mezcal with orange slices and sal de gusano, traditional Mexican spirits presentation on wooden bar',
        bucket: 'product-images'
      }
    ];

    const results = [];

    for (const imgDef of imageDefinitions) {
      try {
        console.log(`Generando imagen: ${imgDef.name}`);
        
        // Generar imagen usando OpenAI
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-image-1',
            prompt: imgDef.prompt,
            n: 1,
            size: '1024x1024',
            output_format: 'webp',
            quality: 'high'
          }),
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.data || !data.data[0]) {
          throw new Error('No se recibió imagen de OpenAI');
        }

        // Obtener la imagen como base64
        const imageBase64 = data.data[0].b64_json;
        
        // Convertir base64 a blob
        const imageBytes = Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0));
        
        // Subir a Supabase Storage
        const fileName = `${imgDef.name}.webp`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(imgDef.bucket)
          .upload(fileName, imageBytes, {
            contentType: 'image/webp',
            upsert: true
          });

        if (uploadError) {
          throw new Error(`Error subiendo imagen: ${uploadError.message}`);
        }

        // Obtener URL pública
        const { data: urlData } = supabase.storage
          .from(imgDef.bucket)
          .getPublicUrl(fileName);

        results.push({
          name: imgDef.name,
          type: imgDef.type,
          url: urlData.publicUrl,
          success: true
        });

        console.log(`✅ Imagen generada y subida: ${imgDef.name}`);
        
      } catch (error) {
        console.error(`❌ Error con imagen ${imgDef.name}:`, error);
        results.push({
          name: imgDef.name,
          type: imgDef.type,
          error: error.message,
          success: false
        });
      }

      // Pequeña pausa entre cada imagen
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return new Response(JSON.stringify({ 
      success: true, 
      results,
      message: `Procesadas ${results.length} imágenes`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error en upload-images function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});