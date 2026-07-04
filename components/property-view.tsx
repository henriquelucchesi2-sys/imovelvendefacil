"use client";

import { useState } from "react";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  Share2,
  MapPin,
  Ruler,
  Bed,
  Bath,
  Car,
  Building2,
  Copy,
  Check,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PropertyViewProps {
  property: Property;
}

function Lightbox({
  images,
  index,
  onClose,
}: {
  images: string[];
  index: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(index);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 bg-black/95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/60 rounded-full p-2"
        >
          <X className="h-5 w-5 text-white" />
        </button>
        <div className="relative flex items-center justify-center min-h-[60vh]">
          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrent((p) => (p === 0 ? images.length - 1 : p - 1))
                }
                className="absolute left-4 bg-black/60 rounded-full p-2"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <button
                onClick={() =>
                  setCurrent((p) => (p === images.length - 1 ? 0 : p + 1))
                }
                className="absolute right-4 bg-black/60 rounded-full p-2"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            </>
          )}
          <img
            src={images[current]}
            alt={`Foto ${current + 1}`}
            className="max-w-full max-h-[80vh] object-contain"
          />
        </div>
        <div className="text-center text-white pb-4 text-sm">
          {current + 1} / {images.length}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PropertyView({ property }: PropertyViewProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse no imóvel: ${property.title} - ${formatPrice(property.price)}`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  function shareOnFacebook() {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  }

  function shareOnWhatsApp() {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${property.title} - ${shareUrl}`)}`,
      "_blank"
    );
  }

  function shareOnTwitter() {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(property.title)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  }

  const images = property.images || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto">
        {images.length > 0 && (
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 h-[50vh] md:h-[60vh]">
              <div
                className="relative overflow-hidden cursor-pointer"
                onClick={() => {
                  setLightboxIndex(0);
                  setLightboxOpen(true);
                }}
              >
                <img
                  src={images[0]}
                  alt={property.title}
                  className="object-cover w-full h-full"
                />
              </div>
              {images.length > 1 && (
                <div className="hidden md:grid grid-cols-2 gap-1">
                  {images.slice(1, 5).map((img, i) => (
                    <div
                      key={i}
                      className="relative overflow-hidden cursor-pointer"
                      onClick={() => {
                        setLightboxIndex(i + 1);
                        setLightboxOpen(true);
                      }}
                    >
                      <img
                        src={img}
                        alt={`${property.title} ${i + 2}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => {
                setLightboxIndex(0);
                setLightboxOpen(true);
              }}
              className="absolute bottom-4 right-4 bg-background/90 rounded-lg px-3 py-1.5 text-sm flex items-center gap-1.5"
            >
              <Maximize2 className="h-4 w-4" />
              Ver todas as fotos ({images.length})
            </button>
          </div>
        )}

        <div className="px-4 py-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {property.tipo && (
                  <Badge variant="secondary" className="capitalize">
                    {property.tipo}
                  </Badge>
                )}
                {property.destaque && (
                  <Badge>{property.destaque}</Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {property.title}
              </h1>
              {(property.cidade || property.endereco) && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {property.endereco}
                    {property.endereco && property.cidade && " - "}
                    {property.cidade}
                    {property.cidade && property.estado && ", "}
                    {property.estado}
                  </span>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-3xl md:text-4xl font-bold text-primary">
                {formatPrice(property.price)}
              </p>
              {(property.condominio || property.iptu) && (
                <p className="text-sm text-muted-foreground mt-1">
                  {property.condominio &&
                    `Cond: ${formatPrice(property.condominio)}`}
                  {property.condominio && property.iptu && " | "}
                  {property.iptu && `IPTU: ${formatPrice(property.iptu)}`}
                </p>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {property.area && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Ruler className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Área</p>
                  <p className="font-semibold">{property.area}m²</p>
                </div>
              </div>
            )}
            {property.quartos && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Bed className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Quartos</p>
                  <p className="font-semibold">{property.quartos}</p>
                </div>
              </div>
            )}
            {property.banheiros && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Bath className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Banheiros</p>
                  <p className="font-semibold">{property.banheiros}</p>
                </div>
              </div>
            )}
            {property.vagas && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Car className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Vagas</p>
                  <p className="font-semibold">{property.vagas}</p>
                </div>
              </div>
            )}
          </div>

          {property.description && (
            <>
              <Separator />
              <div>
                <h2 className="text-xl font-semibold mb-4">Descrição</h2>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {property.description}
                </p>
              </div>
            </>
          )}

          {property.video_url && (
            <>
              <Separator />
              <div>
                <h2 className="text-xl font-semibold mb-4">Vídeo</h2>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={property.video_url.replace("watch?v=", "embed/")}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button size="lg" className="w-full gap-2 bg-green-600 hover:bg-green-700">
                <MessageCircle className="h-5 w-5" />
                Falar com o corretor
              </Button>
            </a>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="lg"
                onClick={shareOnWhatsApp}
                title="Compartilhar no WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={shareOnFacebook}
                title="Compartilhar no Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={shareOnTwitter}
                title="Compartilhar no Twitter/X"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={copyLink}
                title="Copiar link"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          <Separator />

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Anúncio criado por{" "}
              <span className="font-semibold">ImovelVendeFacil</span>
            </p>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
