import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";

export const ImageUploader = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUploadImages = async () => {
    setIsUploading(true);
    
    try {
      // Llamar la función edge para generar y subir imágenes
      const { data, error } = await supabase.functions.invoke('upload-images');
      
      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Error al generar imágenes');
      }

      console.log('Resultados de imágenes:', data.results);

      // Actualizar la base de datos con las nuevas URLs
      const imageUpdates = data.results.filter((result: any) => result.success);
      
      for (const result of imageUpdates) {
        const storageUrl = result.url;
        
        if (result.type === 'category') {
          // Actualizar categorías
          const categoryName = getCategoryNameFromImageName(result.name);
          
          await supabase
            .from('categories')
            .update({ image_url: storageUrl })
            .eq('name', categoryName);
            
        } else if (result.type === 'product') {
          // Actualizar productos - buscar por coincidencia en el nombre del producto
          const productImageMapping = getProductImageMapping();
          const matchingProducts = productImageMapping[result.name] || [];
          
          for (const productName of matchingProducts) {
            await supabase
              .from('products')
              .update({ image_url: storageUrl })
              .ilike('name', `%${productName}%`);
          }
        }
      }

      toast({
        title: "¡Éxito!",
        description: `Se generaron y actualizaron ${imageUpdates.length} imágenes correctamente.`,
      });

      // Recargar la página para ver los cambios
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudieron generar las imágenes.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-card">
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold">Generar y Subir Imágenes</h3>
        <p className="text-muted-foreground">
          Esto generará imágenes AI para todas las categorías y productos, y las subirá a Supabase Storage.
        </p>
        <Button
          onClick={handleUploadImages}
          disabled={isUploading}
          size="lg"
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generando imágenes...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Generar y Subir Imágenes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

// Mapear nombres de imágenes a nombres de categorías
const getCategoryNameFromImageName = (imageName: string): string => {
  const mapping: { [key: string]: string } = {
    'especialidades': 'Especialidades',
    'chilaquiles': 'Chilaquiles', 
    'bebidas': 'Bebidas',
    'bebidas-alcohol': 'Bebidas con Alcohol',
    'tequilas-mezcal': 'Tequilas y Mezcal'
  };
  return mapping[imageName] || imageName;
};

// Mapear nombres de imágenes a nombres de productos
const getProductImageMapping = (): { [key: string]: string[] } => {
  return {
    'bistec-asado': ['Bistec Asado'],
    'tampiquena': ['Tampiquena', 'Tampiqueña'],
    'pollo-mole-verde': ['Pollo en Mole Verde'],
    'pechuga-mole-poblano': ['Pechuga en Mole Poblano'],
    'barbacoa-res': ['Barbacoa de Res'],
    'carnitas-casa': ['Carnitas de la Casa'],
    'cecina-natural': ['Cecina Natural'],
    'ensalada-nopales': ['Ensalada de Nopales'],
    'plato-botanero': ['Plato Botanero'],
    'arroz-mexicano': ['Arroz Mexicano'],
    'chilaquiles-tradicionales': ['Chilaquiles'],
    'agua-jamaica': ['Agua de Jamaica'],
    'agua-horchata': ['Horchata'],
    'cafe-olla': ['Café', 'Americano', 'Capuccino', 'de olla'],
    'jugo-naranja': ['Jugo de Naranja'],
    'tepache': ['Tepache'],
    'limonada': ['Limonada'],
    'cerveza': ['Cerveza'],
    'margarita': ['Margarita'],
    'mezcalita': ['Mezcalita'],
    'paloma': ['Paloma'],
    'mojito': ['Mojito'],
    'cantarito': ['Cantarito'],
    'sangria': ['Sangria'],
    'tequila-blanco': ['Tequila Blanco'],
    'mezcal': ['Mezcal']
  };
};