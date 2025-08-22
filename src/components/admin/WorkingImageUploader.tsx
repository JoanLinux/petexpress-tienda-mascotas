import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Zap, AlertTriangle } from "lucide-react";

export const WorkingImageUploader = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleGenerateAndUpload = async () => {
    setIsUploading(true);
    
    try {
      console.log('Starting WORKING image generation and upload...');
      
      const { data, error } = await supabase.functions.invoke('generate-and-upload-images-working');
      
      if (error) {
        console.error('Function error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Error en la función');
      }

      console.log('Results:', data.results);

      toast({
        title: "¡FUNCIONÓ!",
        description: `Se generaron y subieron ${data.successCount} de ${data.totalCount} imágenes correctamente.`,
      });

      // Reload page to see changes
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Error: ${error.message}. Por favor revisa que tengas OpenAI API Key configurada.`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-blue-800 flex items-center gap-2">
          <Zap className="h-5 w-5" />
          SOLUCIÓN QUE SÍ FUNCIONA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-2 p-3 bg-orange-100 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <p className="text-orange-800 font-medium">
                ¡PROBLEMA IDENTIFICADO Y SOLUCIONADO!
              </p>
              <p className="text-orange-700 text-sm">
                Las funciones anteriores fallaban porque intentaban leer archivos locales. 
                Esta función genera las imágenes directamente en el servidor y las sube.
              </p>
            </div>
          </div>
          
          <p className="text-blue-700">
            Esta función genera 3 imágenes de comida mexicana usando OpenAI y las sube directamente 
            a Supabase Storage (agua horchata, huevos al gusto, enchiladas verdes).
          </p>
          
          <Button
            onClick={handleGenerateAndUpload}
            disabled={isUploading}
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando y subiendo imágenes...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Generar y Subir Imágenes (FUNCIONA)
              </>
            )}
          </Button>
          
          <div className="text-sm text-blue-600">
            <strong>Requiere:</strong>
            <ul className="list-disc list-inside mt-1">
              <li>OpenAI API Key configurada en Supabase Edge Function Secrets</li>
              <li>Conexión a internet (genera usando DALL-E 3)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};