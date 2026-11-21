import { describe, expect, it } from "vitest";
import { Money } from "../shared/money";
import { profitability } from "./project";

const dt = (v: number) => Money.fromDinars(v);

describe("Rentabilité d'un projet", () => {
  it("marge = chiffre d'affaires - coûts, et son taux", () => {
    const result = profitability([dt(3000), dt(2000)], [dt(450.5), dt(1500)]);
    expect(result.margin.toDinars()).toBe(3049.5);
    expect(result.marginRate).toBe(61); // 3 049,5 / 5 000
  });

  it("un projet sans facture n'a pas de taux de marge", () => {
    expect(profitability([], [dt(100)]).marginRate).toBeNull();
  });
});
