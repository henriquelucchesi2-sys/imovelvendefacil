"use client";

import { useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
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

async function loadImage(url: string): Promise<HTMLImageElement> {
  const response = await fetch(url, { mode: "cors" });
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = objectUrl;
    });
    return img;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function generate(property: Property): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, W, H);

  const imageUrl = property.images?.[0];
  const hasImage = imageUrl && imageUrl.length > 0;

  if (hasImage) {
    try {
      const img = await loadImage(imageUrl);
      const iw = W;
      const ih = H * 0.55;
      const sx = Math.max(0, (img.naturalWidth - img.naturalHeight * (iw / ih)) / 2);
      ctx.drawImage(img, sx, 0, img.naturalWidth - sx * 2, img.naturalHeight, 0, 0, iw, ih);
    } catch {
      drawGradient(ctx);
    }
  } else {
    drawGradient(ctx);
  }

  drawOverlay(ctx, property);
  return canvas.toDataURL("image/png");
}

function drawGradient(ctx: CanvasRenderingContext2D) {
  const grad = ctx.createLinearGradient(0, 0, 0, H * 0.55);
  grad.addColorStop(0, "#334155");
  grad.addColorStop(1, "#0f172a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H * 0.55);

  ctx.font = "bold 36px Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.textAlign = "center";
  ctx.fillText("ImovelVendeFacil", W / 2, H * 0.55 / 2);
  ctx.textAlign = "start";
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
  ctx.textAlign = "start";
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
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    setLoading(true);
    try {
      const dataUrl = await generate(property);
      const link = document.createElement("a");
      link.download = `${property.slug || "imovel"}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Imagem baixada! Agora é só postar no Instagram.");
    } catch (err) {
      toast.error("Erro ao gerar imagem", {
        description: "Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }, [property]);

  return (
    <div onClick={() => { if (!loading) handleClick(); }}>
      {loading ? (
        <div className="flex flex-col items-center gap-1 group cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          </div>
          <span className="text-xs text-muted-foreground">Gerando...</span>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
