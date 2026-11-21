import { EXPENSE_CATEGORIES, type ExpenseView } from "@cashpilot/application";
import Link from "next/link";
import { formatDate } from "@/lib/format-date";
import { formatMoney } from "@/lib/format-money";
import { ExpenseStatusBadge } from "./expense-status-badge";

export function ExpenseTable({ expenses }: { expenses: ExpenseView[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm whitespace-nowrap">
        <thead className="border-b border-slate-200 text-left text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Libellé</th>
            <th className="hidden px-4 py-3 font-medium xl:table-cell">Catégorie</th>
            <th className="px-4 py-3 font-medium">Soumise par</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 text-right font-medium">Montant</th>
            <th className="px-4 py-3 font-medium">Statut</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {expenses.map((expense) => (
            <tr key={expense.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium">
                <Link href={`/depenses/${expense.id}`} className="text-brand-700 hover:underline">
                  {expense.label}
                </Link>
              </td>
              <td className="hidden px-4 py-3 text-slate-500 xl:table-cell">{EXPENSE_CATEGORIES[expense.category]}</td>
              <td className="px-4 py-3">{expense.submitterName}</td>
              <td className="px-4 py-3 text-slate-500">{formatDate(expense.date)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{formatMoney(expense.amount)}</td>
              <td className="px-4 py-3">
                <ExpenseStatusBadge status={expense.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
