"use client";

import { useState, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Camera } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import type { Property } from "@/lib/types";

interface Props {
  property: Property;
  children: React.ReactNode;
}

const W = 1080;
const H = 1080;
const PAD = 48;

async function generate(property: Property): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const imageUrl = property.images?.[0];

  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, W, H);

  if (imageUrl) {
    await drawImage(ctx, imageUrl);
  } else {
    drawGradient(ctx);
  }

  drawOverlay(ctx, property);
  return canvas.toDataURL("image/png");
}

function drawImage(ctx: CanvasRenderingContext2D, url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const iw = W;
      const ih = H * 0.55;
      const sx = Math.max(0, (img.naturalWidth - img.naturalHeight * (iw / ih)) / 2);
      ctx.drawImage(img, sx, 0, img.naturalWidth - sx * 2, img.naturalHeight, 0, 0, iw, ih);
      resolve();
    };
    img.onerror = () => {
      drawGradient(ctx);
      resolve();
    };
    img.src = url;
  });
}

function drawGradient(ctx: CanvasRenderingContext2D) {
  const grad = ctx.createLinearGradient(0, 0, 0, H * 0.55);
  grad.addColorStop(0, "#1e293b");
  grad.addColorStop(1, "#0f172a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H * 0.55);
}

function drawOverlay(ctx: CanvasRenderingContext2D, property: Property) {
  const imageBottom = H * 0.55;

  const grad = ctx.createLinearGradient(0, imageBottom - 120, 0, imageBottom);
  grad.addColorStop(0, "rgba(15,23,42,0)");
  grad.addColorStop(1, "rgba(15,23,42,1)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, imageBottom - 120, W, 120);

  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, imageBottom, W, H - imageBottom);

  let y = imageBottom + PAD;

  ctx.font = "bold 64px Arial, sans-serif";
  ctx.fillStyle = "#ffffff";
  const titleLines = wrapText(ctx, property.title, PAD, y, W - PAD * 2, 72);
  y += titleLines * 72 + 16;

  ctx.font = "bold 52px Arial, sans-serif";
  ctx.fillStyle = "#34d399";
  ctx.fillText(formatPrice(property.price), PAD, y + 52);
  y += 80;

  const location = [property.cidade, property.estado].filter(Boolean).join(", ");
  if (location) {
    ctx.font = "28px Arial, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText(location, PAD, y + 28);
    y += 52;
  }

  const features: string[] = [];
  if (property.area) features.push(`${property.area}m²`);
  if (property.quartos) features.push(`${property.quartos} quartos`);
  if (property.banheiros) features.push(`${property.banheiros} banheiros`);
  if (property.vagas) features.push(`${property.vagas} vagas`);
  if (features.length > 0) {
    ctx.font = "26px Arial, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillText(features.join("  ·  "), PAD, y + 26);
  }

  ctx.font = "20px Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillText("ImovelVendeFacil", PAD, H - PAD);
  const wa = `WhatsApp: (${WHATSAPP_NUMBER.slice(2, 4)}) ${WHATSAPP_NUMBER.slice(4, 9)}-${WHATSAPP_NUMBER.slice(9)}`;
  ctx.textAlign = "right";
  ctx.fillText(wa, W - PAD, H - PAD);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(" ");
  let line = "";
  let lines = 0;
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line.trim(), x, y + lines * lineHeight);
      lines++;
      line = word + " ";
    } else {
      line = test;
    }
  }
  if (line.trim()) {
    ctx.fillText(line.trim(), x, y + lines * lineHeight);
    lines++;
  }
  return lines;
}

export function PropertyImageCard({ property, children }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const generateImage = useCallback(async () => {
    setLoading(true);
    setPreview(null);
    try {
      const dataUrl = await generate(property);
      setPreview(dataUrl);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao gerar imagem", {
        description: "Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }, [property]);

  function downloadImage() {
    if (!preview) return;
    const link = document.createElement("a");
    link.download = `${property.slug || "imovel"}.png`;
    link.href = preview;
    link.click();
  }

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
            className="relative w-full overflow-hidden rounded-lg bg-muted"
            style={{ aspectRatio: "1/1", maxWidth: 400, margin: "0 auto" }}
          >
            {preview ? (
              <img
                src={preview}
                alt="Card do imóvel"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                {loading ? "Gerando..." : "Clique em 'Gerar imagem'"}
              </div>
            )}
          </div>

          <Button
            onClick={generateImage}
            disabled={loading}
            className="w-full"
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
            <Button onClick={downloadImage} variant="outline" className="w-full gap-2">
              <Download className="h-4 w-4" />
              Baixar PNG
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
