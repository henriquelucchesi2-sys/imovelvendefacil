"use client";

import { useRef, useState, useCallback } from "react";
import html2canvas from "html2canvas";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Camera } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import type { Property } from "@/lib/types";

interface Props {
  property: Property;
  children: React.ReactNode;
}

export function PropertyImageCard({ property, children }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const generateImage = useCallback(async () => {
    if (!cardRef.current) return;
    setLoading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        width: 1080,
        height: 1080,
        scale: 1,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
      });
      const dataUrl = canvas.toDataURL("image/png");
      setPreview(dataUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  function downloadImage() {
    if (!preview) return;
    const link = document.createElement("a");
    link.download = `${property.slug || "imovel"}.png`;
    link.href = preview;
    link.click();
  }

  const mainImage =
    property.images && property.images.length > 0
      ? property.images[0]
      : null;

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v) setPreview(null); }}>
      <div onClick={() => setOpen(true)}>{children}</div>
      <DialogContent className="max-w-lg">
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Camera className="h-5 w-5" />
            Card para Instagram
          </div>
          <p className="text-sm text-muted-foreground">
            Gere uma imagem do imóvel para postar no Instagram.
          </p>

          <div
            ref={cardRef}
            className="relative w-full overflow-hidden rounded-lg"
            style={{ aspectRatio: "1/1", maxWidth: 400, margin: "0 auto" }}
          >
            {mainImage ? (
              <img
                src={mainImage}
                alt={property.title}
                className="absolute inset-0 w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                <span className="text-white/40 text-lg font-semibold">Sem foto</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <p className="text-xs uppercase tracking-wider text-white/70 mb-1">
                {property.tipo || "Imóvel"}
              </p>
              <h3 className="text-lg font-bold leading-tight mb-1">
                {property.title}
              </h3>
              <p className="text-xl font-bold text-emerald-400 mb-2">
                {formatPrice(property.price)}
              </p>
              {(property.cidade || property.estado) && (
                <p className="text-xs text-white/80 mb-2">
                  {[property.cidade, property.estado].filter(Boolean).join(", ")}
                </p>
              )}
              <div className="flex items-center gap-3 text-xs text-white/80">
                {property.area && <span>{property.area}m²</span>}
                {property.quartos && <span>{property.quartos} quartos</span>}
                {property.vagas && <span>{property.vagas} vagas</span>}
              </div>
              <div className="mt-3 pt-2 border-t border-white/20 text-[10px] text-white/50 flex items-center justify-between">
                <span>ImovelVendeFacil</span>
                <span>WhatsApp: ({WHATSAPP_NUMBER.slice(2, 4)}) {WHATSAPP_NUMBER.slice(4, 9)}-{WHATSAPP_NUMBER.slice(9)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={generateImage}
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                "Gerar imagem"
              )}
            </Button>
            {preview && (
              <Button onClick={downloadImage} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Baixar PNG
              </Button>
            )}
          </div>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full rounded-lg border"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
