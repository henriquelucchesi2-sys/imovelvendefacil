"use client";

import { useState } from "react";
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

function generate(property: Property): string {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const imageBottom = H * 0.55;

  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, "#1e293b");
  bgGrad.addColorStop(0.55, "#0f172a");
  bgGrad.addColorStop(1, "#0f172a");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  const fadeGrad = ctx.createLinearGradient(0, imageBottom - 120, 0, imageBottom);
  fadeGrad.addColorStop(0, "rgba(15,23,42,0)");
  fadeGrad.addColorStop(1, "rgba(15,23,42,1)");
  ctx.fillStyle = fadeGrad;
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

  return canvas.toDataURL("image/png");
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

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 50));
      const dataUrl = generate(property);
      const link = document.createElement("a");
      link.download = `${property.slug || "imovel"}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Imagem baixada!");
    } catch (err) {
      toast.error("Erro ao gerar imagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-1 group cursor-pointer">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center">
          <Loader2 className="h-6 w-6 text-white animate-spin" />
        </div>
        <span className="text-xs text-muted-foreground">Gerando...</span>
      </div>
    );
  }

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {children}
    </div>
  );
}
