import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ConfirmPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Verifique seu email</CardTitle>
          <CardDescription>
            Enviamos um link de confirmação para seu email. Clique no link para
            ativar sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-6">
            Não recebeu? Verifique sua caixa de spam ou tente se cadastrar
            novamente.
          </p>
          <Link href="/auth/login">
            <Button>Ir para o login</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
