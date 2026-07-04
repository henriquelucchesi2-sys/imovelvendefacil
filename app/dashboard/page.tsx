import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, ExternalLink, BarChart3, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const propertyCount = properties?.length ?? 0;
  const totalViews =
    properties?.reduce((acc, p) => acc + (p.views || 0), 0) ?? 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meus Imóveis</h1>
          <p className="text-muted-foreground">
            Gerencie seus imóveis e páginas de venda
          </p>
        </div>
        <Link href="/dashboard/properties/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Imóvel
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Imóveis Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{propertyCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Visualizações Totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalViews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Plano Gratuito
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {propertyCount}/{3}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {propertyCount >= 3
                ? "Limite atingido"
                : `${3 - propertyCount} imóvel(is) restante(s)`}
            </p>
          </CardContent>
        </Card>
      </div>

      {!properties || properties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="mb-2">Nenhum imóvel cadastrado</CardTitle>
            <CardDescription className="mb-6 text-center">
              Crie sua primeira página de venda e comece a divulgar nas redes
              sociais!
            </CardDescription>
            <Link href="/dashboard/properties/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Criar primeiro imóvel
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              {property.images && property.images.length > 0 && (
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg truncate">
                  {property.title}
                </CardTitle>
                <CardDescription>
                  {property.cidade && property.estado
                    ? `${property.cidade}, ${property.estado}`
                    : property.endereco || "Localização não informada"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(property.price)}
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Eye className="h-4 w-4" />
                    {property.views || 0}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/${property.slug}`}
                    target="_blank"
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Ver página
                    </Button>
                  </Link>
                  <Link href={`/dashboard/properties/${property.id}`} className="flex-1">
                    <Button size="sm" className="w-full">
                      Editar
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
