import type { InvoiceView } from "@cashpilot/application";
import { formatDate } from "@/lib/format-date";
import { formatMoney } from "@/lib/format-money";
import { ReversePaymentForm } from "./reverse-payment-form";

type Props = {
  payments: InvoiceView["payments"];
  invoiceId?: string; // fourni seulement si l'utilisateur peut corriger
};

/** Historique des encaissements : les corrections restent visibles, en rouge. */
export function PaymentList({ payments, invoiceId }: Props) {
  if (payments.length === 0) {
    return <p className="text-sm text-slate-500">Aucun paiement reçu pour l'instant.</p>;
  }
  const reversed = new Set(payments.map((p) => p.reversalOf));

  return (
    <ul className="divide-y divide-slate-100 text-sm">
      {payments.map((payment) => (
        <li key={payment.id} className="py-2">
          <div className="flex justify-between gap-4">
            <span className="text-slate-500">
              {formatDate(payment.date)}
              {payment.reversalOf && <span className="text-red-600"> · Correction : {payment.reason}</span>}
              {reversed.has(payment.id) && <span> · annulé</span>}
            </span>
            <span className={`font-medium tabular-nums ${payment.amount < 0 ? "text-red-600" : ""}`}>
              {formatMoney(payment.amount)}
            </span>
          </div>
          {invoiceId && !payment.reversalOf && !reversed.has(payment.id) && (
            <ReversePaymentForm invoiceId={invoiceId} paymentId={payment.id} />
          )}
        </li>
      ))}
    </ul>
  );
}
