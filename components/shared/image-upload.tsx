"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({
  images,
  onChange,
  maxImages = 10,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const uploadImage = useCallback(
    async (file: File) => {
      if (images.length >= maxImages) return;

      setUploading(true);
      const supabase = createClient();

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `properties/${fileName}`;

      const { error } = await supabase.storage
        .from("imoveis")
        .upload(filePath, file);

      if (error) {
        console.error("Upload error:", error);
        setUploading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("imoveis").getPublicUrl(filePath);

      onChange([...images, publicUrl]);
      setUploading(false);
    },
    [images, onChange, maxImages]
  );

  function removeImage(index: number) {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
        {images.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border group">
            <img
              src={url}
              alt={`Foto ${index + 1}`}
              className="object-cover w-full h-full"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3 text-white" />
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <label className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors">
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <ImagePlus className="h-6 w-6 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">
                  Adicionar
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadImage(file);
                e.target.value = "";
              }}
            />
          </label>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {images.length}/{maxImages} fotos. Clique para adicionar.
      </p>
    </div>
  );
}
