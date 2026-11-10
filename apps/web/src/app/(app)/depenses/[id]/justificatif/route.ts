import { isBusinessError } from "@cashpilot/application";
import { useCases } from "@/container";
import { getCurrentUser } from "@/lib/current-user";

/** Renvoie le fichier justificatif, si l'utilisateur peut voir la dépense. */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const file = await useCases.getReceipt.execute(await getCurrentUser(), id);
    return new Response(file.bytes, {
      headers: {
        "Content-Type": file.contentType,
        "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(file.fileName)}`,
      },
    });
  } catch (error) {
    if (isBusinessError(error)) return new Response("Justificatif introuvable.", { status: 404 });
    throw error;
  }
}
