import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Documents() {
  useEffect(() => {
    document.title = "Documentos | Medical App";
  }, []);

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Documentos</h1>
      <Card>
        <CardHeader>
          <CardTitle>Lista (template)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Exemplo 1</TableCell>
                <TableCell>Áudio</TableCell>
                <TableCell>12 MB</TableCell>
                <TableCell>2025-08-09</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
