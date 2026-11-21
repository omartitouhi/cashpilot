import type { ScenarioInput } from "@cashpilot/application";
import { z } from "zod";

const optionalText = z.string().trim().optional().transform((v) => v || undefined);
const optionalNumber = z.preprocess((v) => (v === "" ? undefined : v), z.coerce.number().positive().optional());
const optionalDate = z.preprocess((v) => (v === "" ? undefined : v), z.coerce.date().optional());

// Les hypothèses arrivent dans l'URL (?delayDays=20...) : rien n'est enregistré.
const ScenarioSchema = z.object({
  delayInvoice: optionalText,
  delayDays: optionalNumber,
  expenseLabel: optionalText,
  expenseAmount: optionalNumber,
  expenseDate: optionalDate,
  incomeLabel: optionalText,
  incomeAmount: optionalNumber,
  incomeDate: optionalDate,
});

export type ScenarioParams = z.infer<typeof ScenarioSchema>;

/** Lit les hypothèses de l'URL. Des valeurs invalides donnent un scénario vide. */
export function readScenario(searchParams: Record<string, string | string[] | undefined>) {
  const parsed = ScenarioSchema.safeParse(searchParams);
  const p: ScenarioParams = parsed.success ? parsed.data : {};
  const scenario: ScenarioInput = { extras: [] };

  if (p.delayInvoice && p.delayDays) scenario.delay = { invoiceId: p.delayInvoice, days: p.delayDays };
  if (p.expenseAmount && p.expenseDate) {
    scenario.extras?.push({ label: p.expenseLabel ?? "Dépense simulée", amount: -p.expenseAmount, date: p.expenseDate });
  }
  if (p.incomeAmount && p.incomeDate) {
    scenario.extras?.push({ label: p.incomeLabel ?? "Rentrée simulée", amount: p.incomeAmount, date: p.incomeDate });
  }
  return { scenario, params: p, isValid: parsed.success };
}
