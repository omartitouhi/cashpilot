import {
  applyScenario,
  effectiveDate,
  Money,
  negativePeriods,
  projectBalance,
  type ExpectedFlow,
  type ForecastPoint,
  type Hypothesis,
} from "@cashpilot/domain";
import type { Clock } from "../ports/clock";
import type { ExpenseRepository } from "../ports/expense-repository";
import type { InvoiceRepository } from "../ports/invoice-repository";
import type { Actor } from "../shared/actor";
import type { GetTreasury } from "../treasury/get-treasury";
import { expectedFlows } from "./expected-flows";

const HORIZON = 90; // jours

/** Une hypothèse ajoutée : montant en dinars, positif = rentrée, négatif = dépense. */
type ExtraFlow = { label: string; amount: number; date: Date };

export type ScenarioInput = {
  delay?: { invoiceId: string; days: number };
  extras?: ExtraFlow[];
};

type Point = { date: Date; balance: number }; // millimes
type Projection = { points: Point[]; shortages: { from: Date; to: Date }[] };

export type ForecastView = {
  startBalance: number;
  base: Projection;
  simulated: Projection | null; // null sans hypothèse
  flows: { id: string; label: string; date: Date; amount: number; simulated: boolean }[];
  invoices: { id: string; label: string }[]; // factures qu'on peut retarder
};

function toProjection(points: ForecastPoint[]): Projection {
  return {
    points: points.map((p) => ({ date: p.date, balance: p.balance.millimes })),
    shortages: negativePeriods(points),
  };
}

function toHypotheses(input: ScenarioInput): Hypothesis[] {
  const extras: Hypothesis[] = (input.extras ?? []).map((extra, i) => ({
    kind: "EXTRA",
    flow: { id: `simulation-${i}`, label: extra.label, date: extra.date, amount: Money.fromDinars(extra.amount) },
  }));
  return input.delay ? [{ kind: "DELAY", flowId: input.delay.invoiceId, days: input.delay.days }, ...extras] : extras;
}

/** Projection à 90 jours, et sa version simulée si des hypothèses sont données. */
export class GetForecast {
  constructor(
    private readonly treasury: GetTreasury, // vérifie aussi la permission
    private readonly invoices: InvoiceRepository,
    private readonly expenses: ExpenseRepository,
    private readonly clock: Clock,
  ) {}

  async execute(actor: Actor, scenario: ScenarioInput = {}): Promise<ForecastView> {
    const { balance } = await this.treasury.execute(actor);
    const [invoices, expenses] = await Promise.all([
      this.invoices.allForCompany(actor.companyId),
      this.expenses.allForCompany(actor.companyId),
    ]);

    const today = this.clock.now();
    const start = Money.fromMillimes(balance);
    const baseFlows = expectedFlows(invoices, expenses);
    const hypotheses = toHypotheses(scenario);
    const simFlows = hypotheses.length > 0 ? applyScenario(baseFlows, hypotheses) : null;
    const isSimulated = (flow: ExpectedFlow) =>
      flow.id.startsWith("simulation-") || flow.id === scenario.delay?.invoiceId;

    return {
      startBalance: balance,
      base: toProjection(projectBalance(start, baseFlows, today, HORIZON)),
      simulated: simFlows && toProjection(projectBalance(start, simFlows, today, HORIZON)),
      flows: (simFlows ?? baseFlows)
        .map((f) => ({ ...f, date: effectiveDate(f, today), amount: f.amount.millimes, simulated: isSimulated(f) }))
        .sort((a, b) => a.date.getTime() - b.date.getTime()),
      invoices: baseFlows.filter((f) => f.amount.isPositive()).map(({ id, label }) => ({ id, label })),
    };
  }
}
