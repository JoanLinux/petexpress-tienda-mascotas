import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, CheckCircle } from "lucide-react";

export const CorrectImageUploader = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUploadCorrectImages = async () => {
    setIsUploading(true);
    
    try {
      console.log('Starting upload of CORRECT images...');
      
      const { data, error } = await supabase.functions.invoke('upload-correct-images');
      
      if (error) {
        console.error('Function error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Error al subir imágenes correctas');
      }

      console.log('Upload results:', data.results);

      toast({
        title: "¡Éxito!",
        description: `Se subieron ${data.successCount} de ${data.totalCount} imágenes correctas sin animales.`,
      });

      // Reload page to see changes
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Error uploading correct images:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron subir las imágenes correctas. Inténtalo de nuevo.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="mb-6 border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Corregir Todas las Imágenes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-green-700">
            <strong>¡IMÁGENES CORREGIDAS!</strong> Esto subirá las imágenes correctas de comida mexicana 
            (SIN ANIMALES) para reemplazar las imágenes incorrectas actuales.
          </p>
          
          <Button
            onClick={handleUploadCorrectImages}
            disabled={isUploading}
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subiendo imágenes correctas...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Subir Imágenes Correctas (Sin Animales)
              </>
            )}
          </Button>
          
          <div className="text-sm text-green-600">
            <strong>Esto corregirá:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>✅ Productos: Agua horchata, huevos, enchiladas, pozole, tacos, flautas, flan</li>
              <li>✅ Categorías: Desayunos, enchiladas, tacos, pozole, flautas, postres</li>
              <li>✅ Solo comida mexicana auténtica (SIN PERROS ni otros animales)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};