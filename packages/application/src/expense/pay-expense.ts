import type { ExpenseRepository } from "../ports/expense-repository";
import { assertCan, type Actor } from "../shared/actor";
import { findExpense } from "./find-expense";

export type PayExpenseInput = { expenseId: string; paidAt: Date };

/** Le gestionnaire financier enregistre le paiement d'une dépense approuvée. */
export class PayExpense {
  constructor(private readonly expenses: ExpenseRepository) {}

  async execute(actor: Actor, { expenseId, paidAt }: PayExpenseInput): Promise<void> {
    assertCan(actor, "expenses:pay");
    const expense = await findExpense(this.expenses, actor, expenseId);
    expense.markPaid(actor.userId, paidAt);
    await this.expenses.save(expense);
  }
}
