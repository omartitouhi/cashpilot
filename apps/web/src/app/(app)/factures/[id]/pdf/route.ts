import { isBusinessError } from "@cashpilot/application";
import { useCases } from "@/container";
import { getCurrentUser } from "@/lib/current-user";

/** Télécharge le PDF d'une facture de l'entreprise. */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const file = await useCases.exportInvoicePdf.execute(await getCurrentUser(), id);
    return new Response(file.bytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${file.fileName}"`,
      },
    });
  } catch (error) {
    if (isBusinessError(error)) return new Response("Facture introuvable.", { status: 404 });
    throw error;
  }
}
