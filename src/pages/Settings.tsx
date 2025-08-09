import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Settings() {
  useEffect(() => {
    document.title = "Configurações | Medical App";
  }, []);

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Configurações</h1>
      <Card>
        <CardHeader>
          <CardTitle>Armazenamento (template)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Escolha do provedor: Supabase Storage ou MinIO direto com URLs pré-assinadas.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
