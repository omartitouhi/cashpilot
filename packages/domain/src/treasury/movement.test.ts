import { describe, expect, it } from "vitest";
import { Money } from "../shared/money";
import { computeBalance, withRunningBalance, type Movement } from "./movement";

const initial = Money.fromDinars(5000);
const movements: Movement[] = [
  { id: "exp-1", date: new Date("2026-03-10"), label: "Figma", amount: Money.fromDinars(-450.5) },
  { id: "pay-1", date: new Date("2026-03-05"), label: "F-0001", amount: Money.fromDinars(1000) },
];

describe("Trésorerie", () => {
  it("solde = initial + encaissements - décaissements", () => {
    expect(computeBalance(initial, movements).toDinars()).toBe(5549.5);
  });

  it("calcule le solde après chaque opération, dans l'ordre des dates", () => {
    const history = withRunningBalance(initial, movements);
    expect(history.map((m) => m.balanceAfter.toDinars())).toEqual([6000, 5549.5]);
  });
});
