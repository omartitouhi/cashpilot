import type { ProjectView } from "@cashpilot/application";
import { formatMoney } from "@/lib/format-money";

type Props = { projects: ProjectView[]; clientNames: Map<string, string> };

/** Rentabilité de chaque projet : chiffre d'affaires, coûts, marge. */
export function ProjectTable({ projects, clientNames }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm whitespace-nowrap">
        <thead className="border-b border-slate-200 text-left text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Projet</th>
            <th className="px-4 py-3 font-medium">Client</th>
            <th className="px-4 py-3 text-right font-medium">Facturé</th>
            <th className="px-4 py-3 text-right font-medium">Coûts</th>
            <th className="px-4 py-3 text-right font-medium">Marge</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {projects.map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-3 font-medium">{p.name}</td>
              <td className="px-4 py-3 text-slate-500">{clientNames.get(p.clientId)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{formatMoney(p.revenue)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{formatMoney(p.costs)}</td>
              <td className={`px-4 py-3 text-right font-medium tabular-nums ${p.margin < 0 ? "text-red-600" : "text-brand-700"}`}>
                {formatMoney(p.margin)}
                <span className="ml-2 text-xs text-slate-500">{p.marginRate === null ? "—" : `${p.marginRate} %`}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
