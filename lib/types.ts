export interface Property {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number | null;
  condominio: number | null;
  iptu: number | null;
  area: number | null;
  quartos: number | null;
  banheiros: number | null;
  vagas: number | null;
  tipo: string | null;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  latitude: number | null;
  longitude: number | null;
  destaque: string | null;
  images: string[];
  document_url: string | null;
  video_url: string | null;
  active: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

export type PropertyFormData = Omit<
  Property,
  "id" | "user_id" | "slug" | "views" | "created_at" | "updated_at"
>;

export interface Profile {
  id: string;
  name: string | null;
  created_at: string;
}
