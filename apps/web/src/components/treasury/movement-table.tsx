import type { TreasuryView } from "@cashpilot/application";
import { formatDate } from "@/lib/format-date";
import { formatMoney } from "@/lib/format-money";

export function MovementTable({ movements }: { movements: TreasuryView["movements"] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm whitespace-nowrap">
        <thead className="border-b border-slate-200 text-left text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Opération</th>
            <th className="px-4 py-3 text-right font-medium">Montant</th>
            <th className="px-4 py-3 text-right font-medium">Solde après</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {movements.map((m) => (
            <tr key={m.id}>
              <td className="px-4 py-3 text-slate-500">{formatDate(m.date)}</td>
              <td className="min-w-48 px-4 py-3 whitespace-normal">{m.label}</td>
              <td className={`px-4 py-3 text-right tabular-nums ${m.amount > 0 ? "text-brand-700" : "text-red-600"}`}>
                {m.amount > 0 && "+"}
                {formatMoney(m.amount)}
              </td>
              <td className="px-4 py-3 text-right font-medium tabular-nums">{formatMoney(m.balanceAfter)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
