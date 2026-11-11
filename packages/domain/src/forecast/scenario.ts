import type { ExpectedFlow } from "./projection";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Les hypothèses d'une simulation « What if? ». */
export type Hypothesis =
  | { kind: "DELAY"; flowId: string; days: number } // un client paie en retard
  | { kind: "EXTRA"; flow: ExpectedFlow }; // nouvelle dépense ou rentrée

/** Applique les hypothèses sur une COPIE des flux : les données réelles ne changent pas. */
export function applyScenario(flows: ExpectedFlow[], hypotheses: Hypothesis[]): ExpectedFlow[] {
  let result = [...flows];
  for (const h of hypotheses) {
    if (h.kind === "DELAY") {
      result = result.map((f) =>
        f.id === h.flowId ? { ...f, date: new Date(f.date.getTime() + h.days * DAY_MS) } : f,
      );
    } else {
      result.push(h.flow);
    }
  }
  return result;
}
