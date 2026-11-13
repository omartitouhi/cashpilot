import Link from "next/link";
import type { InvoiceView } from "@cashpilot/application";
import { formatDate } from "@/lib/format-date";
import { formatMoney } from "@/lib/format-money";
import { InvoiceStatusBadge } from "./invoice-status-badge";

type Props = {
  invoices: InvoiceView[];
  clientNames?: Map<string, string>; // absent : la colonne Client est masquée (fiche client)
};

export function InvoiceTable({ invoices, clientNames }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm whitespace-nowrap">
        <thead className="border-b border-slate-200 text-left text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Numéro</th>
            {clientNames && <th className="px-4 py-3 font-medium">Client</th>}
            <th className="px-4 py-3 font-medium">Échéance</th>
            <th className="px-4 py-3 text-right font-medium">Montant</th>
            <th className="px-4 py-3 text-right font-medium">Reste à payer</th>
            <th className="px-4 py-3 font-medium">Statut</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium">
                <Link href={`/factures/${invoice.id}`} className="text-brand-700 hover:underline">
                  {invoice.number}
                </Link>
              </td>
              {clientNames && <td className="px-4 py-3">{clientNames.get(invoice.clientId)}</td>}
              <td className="px-4 py-3 text-slate-500">{formatDate(invoice.dueDate)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{formatMoney(invoice.amount)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{formatMoney(invoice.remaining)}</td>
              <td className="px-4 py-3">
                <InvoiceStatusBadge invoice={invoice} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
