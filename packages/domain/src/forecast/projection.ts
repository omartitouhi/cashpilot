import { startOfDay } from "../shared/dates";
import type { Money } from "../shared/money";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Un flux attendu : encaissement (+) ou décaissement (-) à une date. */
export type ExpectedFlow = {
  id: string; // id de la facture, de la dépense ou de l'hypothèse
  label: string;
  date: Date;
  amount: Money;
};

export type ForecastPoint = { date: Date; balance: Money };

/** Un flux en retard (date passée, pas encore réalisé) est attendu dès aujourd'hui. */
export function effectiveDate(flow: ExpectedFlow, today: Date): Date {
  const day = startOfDay(flow.date);
  return day < startOfDay(today) ? startOfDay(today) : day;
}

/**
 * Solde prévu chaque jour, d'aujourd'hui à aujourd'hui + days :
 * solde réel + flux attendus jusqu'à ce jour.
 */
export function projectBalance(start: Money, flows: ExpectedFlow[], today: Date, days: number): ForecastPoint[] {
  const first = startOfDay(today).getTime();
  return Array.from({ length: days + 1 }, (_, i) => {
    const date = new Date(first + i * DAY_MS);
    const due = flows.filter((f) => effectiveDate(f, today) <= date);
    return { date, balance: due.reduce((sum, f) => sum.add(f.amount), start) };
  });
}

/** Les périodes où le solde prévu est négatif : les manques de liquidités. */
export function negativePeriods(points: ForecastPoint[]): { from: Date; to: Date }[] {
  const periods: { from: Date; to: Date }[] = [];
  for (const point of points) {
    if (!point.balance.isNegative()) continue;
    const last = periods.at(-1);
    const isContinuing = last && point.date.getTime() - last.to.getTime() === DAY_MS;
    if (isContinuing) last.to = point.date;
    else periods.push({ from: point.date, to: point.date });
  }
  return periods;
}
