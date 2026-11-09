import type { Clock } from "../ports/clock";
import type { ExpenseRepository } from "../ports/expense-repository";
import { assertCan, type Actor } from "../shared/actor";
import { findExpense } from "./find-expense";

/** Le dirigeant refuse une dépense soumise, en donnant un motif. */
export class RejectExpense {
  constructor(
    private readonly expenses: ExpenseRepository,
    private readonly clock: Clock,
  ) {}

  async execute(actor: Actor, expenseId: string, reason: string): Promise<void> {
    assertCan(actor, "expenses:approve");
    const expense = await findExpense(this.expenses, actor, expenseId);
    expense.reject(actor.userId, reason, this.clock.now());
    await this.expenses.save(expense);
  }
}
