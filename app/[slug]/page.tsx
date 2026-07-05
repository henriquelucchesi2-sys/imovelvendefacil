import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PropertyView } from "@/components/property-view";
import type { Metadata } from "next";
import { WHATSAPP_NUMBER } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!property) return { title: "Imóvel não encontrado" };

  const description = property.description || `${property.title} - Imóvel à venda`;
  const image = property.images?.[0];

  return {
    title: `${property.title} | ImovelVendeFacil`,
    description,
    openGraph: {
      title: property.title,
      description,
      type: "website",
      images: image ? [image] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: property.title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!property || !property.active) {
    notFound();
  }

  await supabase
    .from("properties")
    .update({ views: (property.views || 0) + 1 })
    .eq("id", property.id);

  const { user_id, ...publicProperty } = property;
  return <PropertyView property={publicProperty as typeof property} />;
}
