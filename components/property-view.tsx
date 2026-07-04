"use client";

import { useState } from "react";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  MessageCircle,
  MapPin,
  Ruler,
  Bed,
  Bath,
  Car,
  Copy,
  Check,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
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

  const shareText = `${property.title} - ${formatPrice(property.price)}\n\n${property.description || ""}\n\n${shareUrl}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  function isMobile() {
    return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  async function shareOnInstagram() {
    await navigator.clipboard.writeText(shareText);
    if (isMobile()) {
      window.open("instagram://", "_blank");
    }
    toast("Texto copiado!", {
      description:
        "Cole no Instagram (bio, stories ou posts) para divulgar o imóvel.",
      duration: 6000,
    });
  }

  function shareOnFacebook() {
    navigator.clipboard.writeText(shareText);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "width=600,height=600"
    );
    toast("Texto copiado!", {
      description:
        "Cole o texto (Ctrl+V) no campo de texto do Facebook e publique. Já abrimos a página com a prévia do seu imóvel.",
      duration: 8000,
    });
  }

  function shareOnWhatsApp() {
    const text = `${property.title} - ${formatPrice(property.price)}\n\n${shareUrl}`;
    if (isMobile()) {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(text)}`,
        "_blank"
      );
    } else {
      navigator.clipboard.writeText(`${text}\n\n${property.description || ""}`);
      toast("Texto copiado!", {
        description:
          "Cole (Ctrl+V) no WhatsApp Web para enviar para um contato.",
        duration: 6000,
      });
    }
  }

  function shareOnTwitter() {
    navigator.clipboard.writeText(shareText);
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(property.title)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "width=600,height=500"
    );
    toast.success("Informações copiadas!", {
      description:
        "Se o preview não carregar, cole o texto que copiamos no Twitter.",
      duration: 4000,
    });
  }

  async function shareNative() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `${property.title} - ${formatPrice(property.price)}`,
          url: shareUrl,
        });
      } catch {}
    } else {
      copyLink();
    }
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
            <Button
              variant="outline"
              size="lg"
              onClick={shareNative}
              className="gap-2"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Compartilhar
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Compartilhe nas redes sociais
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button onClick={shareOnWhatsApp} className="flex flex-col items-center gap-1 group" title="Compartilhar no WhatsApp">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs text-muted-foreground">WhatsApp</span>
              </button>
              <button onClick={shareOnInstagram} className="flex flex-col items-center gap-1 group" title="Compartilhar no Instagram">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.11 2.525c.636-.247 1.363-.416 2.427-.465C8.83 2.013 9.165 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </div>
                <span className="text-xs text-muted-foreground">Instagram</span>
              </button>
              <button onClick={shareOnFacebook} className="flex flex-col items-center gap-1 group" title="Compartilhar no Facebook">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <span className="text-xs text-muted-foreground">Facebook</span>
              </button>
              <button onClick={shareOnTwitter} className="flex flex-col items-center gap-1 group" title="Compartilhar no Twitter/X">
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <span className="text-xs text-muted-foreground">Twitter / X</span>
              </button>
              <button onClick={copyLink} className="flex flex-col items-center gap-1 group" title="Copiar link">
                <div className="w-12 h-12 rounded-full bg-muted-foreground/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {copied ? (
                    <Check className="h-6 w-6 text-green-600" />
                  ) : (
                    <Copy className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">Copiar link</span>
              </button>
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
