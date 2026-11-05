import type { InvoiceView } from "@cashpilot/application";
import { formatDate } from "@/lib/format-date";
import { formatMoney } from "@/lib/format-money";

/** Historique des encaissements d'une facture. */
export function PaymentList({ payments }: { payments: InvoiceView["payments"] }) {
  if (payments.length === 0) {
    return <p className="text-sm text-slate-500">Aucun paiement reçu pour l'instant.</p>;
  }

  return (
    <ul className="divide-y divide-slate-100 text-sm">
      {payments.map((payment) => (
        <li key={payment.id} className="flex justify-between py-2">
          <span className="text-slate-500">{formatDate(payment.date)}</span>
          <span className="font-medium tabular-nums">{formatMoney(payment.amount)}</span>
        </li>
      ))}
    </ul>
  );
}
