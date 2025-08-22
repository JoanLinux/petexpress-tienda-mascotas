import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X } from "lucide-react";

interface CategoryImageUploaderProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
}

export const CategoryImageUploader = ({ onImageUploaded, currentImageUrl }: CategoryImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
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
      const bucket = 'category-images';
      const fileExt = file.name.split('.').pop();
      const fileName = `category-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
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
        description: "Imagen de categoría subida correctamente.",
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

  const handleRemoveImage = () => {
    onImageUploaded('');
  };

  return (
    <div className="space-y-4">
      <Label>Imagen de la Categoría</Label>
      
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
            Imagen actual. Sube una nueva para reemplazarla.
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          No hay imagen seleccionada
        </div>
      )}

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
    </div>
  );
};