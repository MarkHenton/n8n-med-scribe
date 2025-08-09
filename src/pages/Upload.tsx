import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Upload() {
  useEffect(() => {
    document.title = "Enviar arquivo | Medical App";
  }, []);

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Enviar arquivo</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upload (template)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aqui vai o fluxo de upload (Supabase Storage ou MinIO com URL pré-assinada).
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
