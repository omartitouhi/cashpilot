import { describe, expect, it } from "vitest";
import { Money } from "./money";

describe("Money", () => {
  it("additionne sans erreur d'arrondi", () => {
    const total = Money.fromDinars(0.1).add(Money.fromDinars(0.2));
    expect(total.toDinars()).toBe(0.3);
  });

  it("soustrait deux montants", () => {
    const reste = Money.fromDinars(3000).subtract(Money.fromDinars(1200.5));
    expect(reste.toDinars()).toBe(1799.5);
  });

  it("arrondit au millime le plus proche", () => {
    expect(Money.fromDinars(10.0004).millimes).toBe(10000);
  });

  it("refuse un montant qui n'est pas un nombre", () => {
    expect(() => Money.fromDinars(Number.NaN)).toThrow("Le montant est invalide.");
  });
});
