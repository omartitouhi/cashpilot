import { describe, expect, it } from "vitest";
import { Money } from "../shared/money";
import { negativePeriods, projectBalance, type ExpectedFlow } from "./projection";
import { applyScenario } from "./scenario";

// L'exemple du sujet : 5 000 DT en banque, 3 000 DT attendus, 6 000 DT de dépenses prévues.
const today = new Date("2026-03-01");
const start = Money.fromDinars(5000);
const flows: ExpectedFlow[] = [
  { id: "inv-1", label: "Facture F-0001", date: new Date("2026-03-10"), amount: Money.fromDinars(3000) },
  { id: "exp-1", label: "Freelance", date: new Date("2026-03-20"), amount: Money.fromDinars(-6000) },
];

const balanceOn = (points: ReturnType<typeof projectBalance>, iso: string) =>
  points.find((p) => p.date.toISOString().startsWith(iso))?.balance.toDinars();

describe("Prévision", () => {
  it("solde prévu = solde réel + flux attendus jusqu'à la date", () => {
    const points = projectBalance(start, flows, today, 30);
    expect(balanceOn(points, "2026-03-09")).toBe(5000);
    expect(balanceOn(points, "2026-03-10")).toBe(8000);
    expect(balanceOn(points, "2026-03-20")).toBe(2000);
    expect(negativePeriods(points)).toEqual([]);
  });

  it("un retard client de 20 jours crée un manque de liquidités", () => {
    const simulated = applyScenario(flows, [{ kind: "DELAY", flowId: "inv-1", days: 20 }]);
    const points = projectBalance(start, simulated, today, 30);

    expect(balanceOn(points, "2026-03-20")).toBe(-1000);
    expect(negativePeriods(points)).toEqual([{ from: new Date("2026-03-20"), to: new Date("2026-03-29") }]);
  });

  it("la simulation ne modifie pas les flux réels", () => {
    applyScenario(flows, [{ kind: "DELAY", flowId: "inv-1", days: 20 }]);
    expect(flows[0]?.date).toEqual(new Date("2026-03-10"));
  });

  it("un flux en retard est attendu dès aujourd'hui", () => {
    const late = [{ ...flows[0]!, date: new Date("2026-02-01") }];
    expect(balanceOn(projectBalance(start, late, today, 1), "2026-03-01")).toBe(8000);
  });
});
