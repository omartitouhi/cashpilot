import { computeBalance, Expense, Money } from "@cashpilot/domain";
import { describe, expect, it } from "vitest";
import { realizedMovements } from "./realized-movements";

function paidExpense(): Expense {
  const expense = Expense.submit({
    id: "exp-1", companyId: "co-1", submittedBy: "u-member", label: "Licence", category: "SOFTWARE",
    amount: Money.fromDinars(450.5), date: new Date("2026-03-01"), receiptId: null, supplierId: null, projectId: null,
  });
  expense.approve("u-owner", new Date("2026-03-01"));
  expense.markPaid("u-finance", new Date("2026-03-02"));
  return expense;
}

describe("Opérations réalisées", () => {
  it("un paiement de dépense corrigé n'affecte plus le solde, mais reste visible", () => {
    const expense = paidExpense();
    expense.reversePayment("u-finance", "Payé par erreur", new Date("2026-03-04"));

    const movements = realizedMovements([], [expense]);
    expect(movements.map((m) => m.amount.toDinars())).toEqual([-450.5, 450.5]);
    expect(computeBalance(Money.fromDinars(1000), movements).toDinars()).toBe(1000);
  });

  it("payée à nouveau après correction, la dépense compte une seule fois", () => {
    const expense = paidExpense();
    expense.reversePayment("u-finance", "Mauvais montant saisi", new Date("2026-03-04"));
    expense.markPaid("u-finance", new Date("2026-03-05"));

    const movements = realizedMovements([], [expense]);
    expect(computeBalance(Money.fromDinars(1000), movements).toDinars()).toBe(549.5);
  });
});
