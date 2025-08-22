import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";

export const MenuImageUploader = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUploadMenuImages = async () => {
    setIsUploading(true);
    
    try {
      console.log('Starting upload of menu images...');
      
      const { data, error } = await supabase.functions.invoke('upload-menu-images');
      
      if (error) {
        console.error('Function error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Error al subir imágenes del menú');
      }

      console.log('Upload results:', data.results);

      toast({
        title: "¡Éxito!",
        description: `Se subieron ${data.successCount} de ${data.totalCount} imágenes del menú correctamente.`,
      });

      // Reload page to see changes
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Error uploading menu images:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron subir las imágenes del menú. Inténtalo de nuevo.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Subir Imágenes del Menú Completo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Esto subirá las imágenes generadas para todos los productos del menú 
            (desayunos, enchiladas, pozole, tacos, flautas, postres) a Supabase Storage.
          </p>
          
          <Button
            onClick={handleUploadMenuImages}
            disabled={isUploading}
            size="lg"
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subiendo imágenes del menú...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Subir Imágenes del Menú Completo
              </>
            )}
          </Button>
          
          <div className="text-sm text-muted-foreground">
            <strong>Esto procesará imágenes para:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Desayunos: Huevos al gusto, omelettes, huevos rancheros</li>
              <li>Enchiladas: Verdes/rojas, mole poblano</li>
              <li>Pozole: Tradicional, pollo tlalpeño</li>
              <li>Tacos: De guisado, a la parrilla (pastor, bistec, suadero)</li>
              <li>Flautas: Tradicionales, ahogadas, quesadillas</li>
              <li>Postres: Flan, pastel tres leches</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};