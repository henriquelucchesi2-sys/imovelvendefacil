"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ImageUpload } from "@/components/shared/image-upload";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { generateSlug } from "@/lib/utils";
import { PROPERTY_TYPES } from "@/lib/constants";

export default function NewPropertyPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    condominio: "",
    iptu: "",
    area: "",
    quartos: "",
    banheiros: "",
    vagas: "",
    tipo: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    destaque: "",
    video_url: "",
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    const slug = generateSlug(form.title);

    const { error } = await supabase.from("properties").insert({
      user_id: user.id,
      title: form.title,
      slug,
      description: form.description || null,
      price: form.price ? Number(form.price) : null,
      condominio: form.condominio ? Number(form.condominio) : null,
      iptu: form.iptu ? Number(form.iptu) : null,
      area: form.area ? Number(form.area) : null,
      quartos: form.quartos ? Number(form.quartos) : null,
      banheiros: form.banheiros ? Number(form.banheiros) : null,
      vagas: form.vagas ? Number(form.vagas) : null,
      tipo: form.tipo || null,
      endereco: form.endereco || null,
      cidade: form.cidade || null,
      estado: form.estado || null,
      cep: form.cep || null,
      destaque: form.destaque || null,
      video_url: form.video_url || null,
      images,
      active: true,
    });

    if (error) {
      alert("Erro ao salvar: " + error.message);
      setSaving(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Novo Imóvel</h1>
          <p className="text-muted-foreground text-sm">
            Preencha as informações do imóvel
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Fotos</CardTitle>
            <CardDescription>
              Adicione fotos do imóvel (máximo 10)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload images={images} onChange={setImages} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações Principais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do anúncio *</Label>
              <Input
                id="title"
                placeholder="Ex: Apartamento 2 quartos no Centro"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva o imóvel em detalhes..."
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={5}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select
                  value={form.tipo}
                  onValueChange={(v) => updateField("tipo", v ?? "")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="500000"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="area">Área (m²)</Label>
                <Input
                  id="area"
                  type="number"
                  placeholder="70"
                  value={form.area}
                  onChange={(e) => updateField("area", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quartos">Quartos</Label>
                <Input
                  id="quartos"
                  type="number"
                  placeholder="2"
                  value={form.quartos}
                  onChange={(e) => updateField("quartos", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="banheiros">Banheiros</Label>
                <Input
                  id="banheiros"
                  type="number"
                  placeholder="1"
                  value={form.banheiros}
                  onChange={(e) => updateField("banheiros", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vagas">Vagas de garagem</Label>
                <Input
                  id="vagas"
                  type="number"
                  placeholder="1"
                  value={form.vagas}
                  onChange={(e) => updateField("vagas", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="condominio">Condomínio (R$)</Label>
                <Input
                  id="condominio"
                  type="number"
                  placeholder="500"
                  value={form.condominio}
                  onChange={(e) => updateField("condominio", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destaque">Destaque</Label>
              <Input
                id="destaque"
                placeholder="Ex: Reformado, Vista para o mar, Próximo ao metrô"
                value={form.destaque}
                onChange={(e) => updateField("destaque", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Localização</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                placeholder="Rua, número, bairro"
                value={form.endereco}
                onChange={(e) => updateField("endereco", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  placeholder="Rio de Janeiro"
                  value={form.cidade}
                  onChange={(e) => updateField("cidade", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  placeholder="RJ"
                  value={form.estado}
                  onChange={(e) => updateField("estado", e.target.value)}
                  maxLength={2}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                placeholder="20000-000"
                value={form.cep}
                onChange={(e) => updateField("cep", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mídia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="video_url">URL do Vídeo (YouTube/Vimeo)</Label>
              <Input
                id="video_url"
                placeholder="https://youtube.com/watch?v=..."
                value={form.video_url}
                onChange={(e) => updateField("video_url", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/dashboard">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Salvando..." : "Salvar Imóvel"}
          </Button>
        </div>
      </form>
    </div>
  );
}
