import type { InvoiceView } from "@cashpilot/application";
import { Badge, type BadgeTone } from "@/components/ui/badge";

/** Choisit le libellé et la couleur à afficher pour une facture. */
function statusOf(invoice: InvoiceView): { label: string; tone: BadgeTone } {
  if (invoice.status === "DRAFT") return { label: "Brouillon", tone: "neutral" };
  if (invoice.status === "PAID") return { label: "Payée", tone: "success" };
  if (invoice.status === "CANCELLED") return { label: "Annulée", tone: "neutral" };
  if (invoice.isOverdue) return { label: "En retard", tone: "danger" };
  if (invoice.paid > 0) return { label: "Partiellement payée", tone: "warning" };
  return { label: "Validée", tone: "info" };
}

export function InvoiceStatusBadge({ invoice }: { invoice: InvoiceView }) {
  const { label, tone } = statusOf(invoice);
  return <Badge tone={tone}>{label}</Badge>;
}
