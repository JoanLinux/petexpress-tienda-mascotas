import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";

export const BatchImageUploader = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUploadImages = async () => {
    setIsUploading(true);
    
    try {
      console.log('Starting complete image generation and upload...');
      
      const { data, error } = await supabase.functions.invoke('generate-and-upload-all-images');
      
      if (error) {
        console.error('Function error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Error al generar y subir imágenes');
      }

      console.log('Generation results:', data.results);

      toast({
        title: "¡Éxito!",
        description: `Se generaron y subieron ${data.successCount} de ${data.totalCount} imágenes correctamente.`,
      });

      // Reload page to see changes
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Error generating and uploading images:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron generar y subir las imágenes. Inténtalo de nuevo.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Generar y Subir Imágenes AI</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Esto generará imágenes AI para todos los productos y categorías, las subirá a 
            Supabase Storage y actualizará las URLs en la base de datos.
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
                Generando y subiendo imágenes...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Generar y Subir Todas las Imágenes
              </>
            )}
          </Button>
          
          <div className="text-sm text-muted-foreground">
            <strong>Esto procesará:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Productos: Agua de jamaica, Arroz mexicano, Barbacoa de res, Bistec asado, Café</li>
              <li>Categorías: Bebidas, Bebidas con alcohol, Chilaquiles, Especialidades, Tequilas y mezcal</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};