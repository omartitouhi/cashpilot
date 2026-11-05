import type { InvoiceView } from "@cashpilot/application";
import { cancelInvoiceAction, validateInvoiceAction } from "@/app/(app)/factures/actions";
import { ActionButton } from "@/components/ui/action-button";
import { toInputDate } from "@/lib/format-date";
import { PaymentForm } from "./payment-form";

/** Affiche les actions possibles selon le statut de la facture. */
export function InvoiceActions({ invoice }: { invoice: InvoiceView }) {
  const canCancel = invoice.status === "DRAFT" || (invoice.status === "ISSUED" && invoice.paid === 0);

  return (
    <div className="flex flex-col gap-4">
      {invoice.status === "DRAFT" && (
        <ActionButton action={validateInvoiceAction.bind(null, invoice.id)}>Valider la facture</ActionButton>
      )}

      {invoice.status === "ISSUED" && (
        <PaymentForm
          invoiceId={invoice.id}
          remainingDinars={invoice.remaining / 1000}
          today={toInputDate(new Date())}
        />
      )}

      {canCancel && (
        <ActionButton action={cancelInvoiceAction.bind(null, invoice.id)} variant="secondary">
          Annuler la facture
        </ActionButton>
      )}

      {invoice.status === "PAID" && <p className="text-sm text-slate-500">Cette facture est soldée.</p>}
      {invoice.status === "CANCELLED" && <p className="text-sm text-slate-500">Cette facture est annulée.</p>}
    </div>
  );
}
