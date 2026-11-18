import type { Clock } from "../ports/clock";
import type { ExpenseRepository } from "../ports/expense-repository";
import { assertCan, type Actor } from "../shared/actor";
import { findExpense } from "./find-expense";

/** Annule un paiement de dépense enregistré par erreur, avec un motif. */
export class ReverseExpensePayment {
  constructor(
    private readonly expenses: ExpenseRepository,
    private readonly clock: Clock,
  ) {}

  async execute(actor: Actor, expenseId: string, reason: string): Promise<void> {
    assertCan(actor, "expenses:pay");
    const expense = await findExpense(this.expenses, actor, expenseId);
    expense.reversePayment(actor.userId, reason, this.clock.now());
    await this.expenses.save(expense);
  }
}
