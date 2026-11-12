import type { ForecastView } from "@cashpilot/application";
import { formatDate } from "@/lib/format-date";
import { formatMoney } from "@/lib/format-money";

type Projection = ForecastView["base"];

/** Solde prévu à J+30, J+60 et J+90, avec la simulation à côté. */
export function HorizonTable({ base, simulated }: { base: Projection; simulated: Projection | null }) {
  const color = (v: number) => (v < 0 ? "text-red-600" : "");

  return (
    <table className="w-full text-sm">
      <thead className="text-left text-slate-500">
        <tr>
          <th className="pb-2 font-medium">Horizon</th>
          <th className="pb-2 text-right font-medium">Prévision</th>
          {simulated && <th className="pb-2 text-right font-medium">Simulation</th>}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {[30, 60, 90].map((day) => {
          const b = base.points[day]?.balance ?? 0;
          const s = simulated?.points[day]?.balance ?? 0;
          return (
            <tr key={day}>
              <td className="py-2">Dans {day} jours</td>
              <td className={`py-2 text-right font-medium tabular-nums ${color(b)}`}>{formatMoney(b)}</td>
              {simulated && <td className={`py-2 text-right font-medium tabular-nums ${color(s)}`}>{formatMoney(s)}</td>}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/** Les périodes de manque de liquidités, ou un message rassurant. */
export function ShortageList({ title, shortages }: { title: string; shortages: Projection["shortages"] }) {
  return (
    <div>
      <p className="mb-1 text-sm font-medium">{title}</p>
      {shortages.length === 0 ? (
        <p className="text-sm text-slate-500">Aucun manque de liquidités prévu.</p>
      ) : (
        <ul className="text-sm text-red-700">
          {shortages.map((s) => (
            <li key={s.from.toISOString()}>
              Solde négatif du {formatDate(s.from)} au {formatDate(s.to)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Les flux attendus utilisés par le calcul : c'est l'explication des montants. */
export function FlowList({ flows }: { flows: ForecastView["flows"] }) {
  if (flows.length === 0) return <p className="text-sm text-slate-500">Aucun flux attendu sur la période.</p>;

  return (
    <ul className="divide-y divide-slate-100 text-sm">
      {flows.map((flow) => (
        <li key={flow.id} className="flex items-center gap-3 py-2">
          <span className="w-24 shrink-0 text-slate-500">{formatDate(flow.date)}</span>
          <span className="truncate">{flow.label}</span>
          {flow.simulated && (
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">Simulation</span>
          )}
          <span className={`ml-auto font-medium tabular-nums ${flow.amount < 0 ? "text-red-600" : "text-brand-700"}`}>
            {flow.amount > 0 && "+"}
            {formatMoney(flow.amount)}
          </span>
        </li>
      ))}
    </ul>
  );
}
