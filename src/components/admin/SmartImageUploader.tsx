import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X, Wand2 } from "lucide-react";

interface SmartImageUploaderProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
  productName?: string;
}

export const SmartImageUploader = ({ onImageUploaded, currentImageUrl, productName }: SmartImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor selecciona un archivo de imagen válido.",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El archivo no puede ser mayor a 5MB.",
      });
      return;
    }

    setIsUploading(true);

    try {
      const bucket = 'product-images';
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(uploadError.message);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;
      onImageUploaded(imageUrl);

      toast({
        title: "¡Éxito!",
        description: "Imagen subida correctamente.",
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo subir la imagen. Inténtalo de nuevo.",
      });
    } finally {
      setIsUploading(false);
      // Clear the input
      event.target.value = '';
    }
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor escribe una descripción para generar la imagen.",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Build the prompt with context
      const fullPrompt = `Fotografía profesional de ${aiPrompt}, comida mexicana auténtica, presentación de restaurante, iluminación natural, alta calidad, ultra realista, 4K`;

      const { data, error } = await supabase.functions.invoke('generate-product-image', {
        body: { 
          prompt: fullPrompt,
          productName: productName || 'producto'
        }
      });

      if (error) throw error;

      if (data.imageUrl) {
        onImageUploaded(data.imageUrl);
        setAiPrompt('');
        toast({
          title: "¡Éxito!",
          description: "Imagen generada y subida correctamente.",
        });
      } else {
        throw new Error('No se recibió URL de imagen');
      }

    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo generar la imagen. Inténtalo de nuevo.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRemoveImage = () => {
    onImageUploaded('');
  };

  return (
    <div className="space-y-4">
      <Label>Imagen del Producto</Label>
      
      {currentImageUrl ? (
        <div className="space-y-4">
          <div className="relative inline-block">
            <img 
              src={currentImageUrl} 
              alt="Imagen actual" 
              className="w-32 h-32 object-cover rounded-lg border"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6"
              onClick={handleRemoveImage}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Imagen actual. Puedes generar una nueva o subir otra.
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          No hay imagen seleccionada
        </div>
      )}

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">
            <Upload className="h-4 w-4 mr-2" />
            Subir Archivo
          </TabsTrigger>
          <TabsTrigger value="generate">
            <Wand2 className="h-4 w-4 mr-2" />
            Generar con AI
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="cursor-pointer"
            />
            {isUploading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Subiendo...
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            Formatos soportados: JPG, PNG, GIF. Tamaño máximo: 5MB.
          </div>
        </TabsContent>
        
        <TabsContent value="generate" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ai-prompt">Descripción del platillo</Label>
            <Textarea
              id="ai-prompt"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ej: tacos al pastor con piña, salsa verde y cebolla"
              disabled={isGenerating}
              rows={3}
            />
          </div>
          
          <Button
            onClick={handleGenerateAI}
            disabled={isGenerating || !aiPrompt.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generando imagen...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generar Imagen AI
              </>
            )}
          </Button>
          
          <div className="text-xs text-muted-foreground">
            La AI generará una imagen profesional de comida mexicana basada en tu descripción.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};