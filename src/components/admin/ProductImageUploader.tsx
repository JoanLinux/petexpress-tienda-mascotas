import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";

export const ProductImageUploader = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUploadAllProductImages = async () => {
    setIsUploading(true);
    
    try {
      console.log('Starting upload of all product images...');
      
      const { data, error } = await supabase.functions.invoke('upload-all-product-images');
      
      if (error) {
        console.error('Function error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Error al subir imágenes de productos');
      }

      console.log('Upload results:', data.results);

      toast({
        title: "¡Éxito!",
        description: `Se subieron ${data.successCount} de ${data.totalCount} imágenes de productos correctamente.`,
      });

      // Reload page to see changes
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Error uploading product images:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron subir las imágenes de productos. Inténtalo de nuevo.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Subir Imágenes de Todos los Productos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Esto subirá imágenes generadas para todos los productos en la base de datos
            a Supabase Storage y actualizará las URLs en la base de datos.
          </p>
          
          <Button
            onClick={handleUploadAllProductImages}
            disabled={isUploading}
            size="lg"
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subiendo imágenes de productos...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Subir Todas las Imágenes de Productos
              </>
            )}
          </Button>
          
          <div className="text-sm text-muted-foreground">
            <strong>Esto procesará imágenes para:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Bebidas: Agua de horchata, jamaica, embotellada, café, cerveza, etc.</li>
              <li>Platillos: Arroces, barbacoa, bistec, carnitas, cecina, etc.</li>
              <li>Especialidades: Chilaquiles, ensaladas, cantaritos, etc.</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};