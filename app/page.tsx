import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Home,
  Image,
  Share2,
  MessageCircle,
  BarChart3,
  ChevronRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="font-bold text-xl">ImovelVendeFacil</span>
          <div className="flex gap-3">
            <Link href="/auth/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/auth/cadastro">
              <Button>Criar conta grátis</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Crie páginas de venda para seus imóveis em minutos
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Cadastre seu imóvel, compartilhe o link nas redes sociais e venda mais
          rápido. Sem complicação.
        </p>
        <Link href="/auth/cadastro">
          <Button size="lg" className="text-lg px-8">
            Começar gratuitamente
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        <p className="text-sm text-muted-foreground mt-3">
          Grátis para até 3 imóveis. Sem cartão de crédito.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Como funciona
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>1. Cadastre o imóvel</CardTitle>
              <CardDescription>
                Adicione fotos, preço, descrição e localização em um formulário
                simples.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>2. Compartilhe</CardTitle>
              <CardDescription>
                Copie o link e compartilhe no Instagram, Facebook, WhatsApp e
                outras redes.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>3. Receba contatos</CardTitle>
              <CardDescription>
                Os interessados entram em contato direto pelo WhatsApp com um
                clique.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="bg-muted/50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Recursos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Home,
                title: "Página de venda profissional",
                desc: "Design responsivo e otimizado para mobile",
              },
              {
                icon: Image,
                title: "Galeria de fotos",
                desc: "Até 10 fotos com visualização em tela cheia",
              },
              {
                icon: Share2,
                title: "Compartilhamento social",
                desc: "Preview bonito ao compartilhar no Instagram, Facebook e WhatsApp",
              },
              {
                icon: MessageCircle,
                title: "Botão do WhatsApp",
                desc: "Contato direto com um clique para o corretor",
              },
              {
                icon: BarChart3,
                title: "Estatísticas",
                desc: "Veja quantas pessoas visualizaram seu imóvel",
              },
              {
                icon: Home,
                title: "Link personalizado",
                desc: "URL única e fácil de memorizar para cada imóvel",
              },
            ].map((item, i) => (
              <Card key={i}>
                <CardHeader>
                  <item.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Pronto para começar?
        </h2>
        <p className="text-muted-foreground mb-8">
          Crie sua conta gratuita em menos de 1 minuto.
        </p>
        <Link href="/auth/cadastro">
          <Button size="lg" className="text-lg px-8">
            Criar conta gratuita
          </Button>
        </Link>
      </section>

      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          ImovelVendeFacil - Micro SaaS para corretores de imóveis
        </div>
      </footer>
    </div>
  );
}
