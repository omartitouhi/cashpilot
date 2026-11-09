import type { Clock } from "../ports/clock";
import type { ExpenseRepository } from "../ports/expense-repository";
import { assertCan, type Actor } from "../shared/actor";
import { findExpense } from "./find-expense";

/** Le dirigeant approuve une dépense soumise. */
export class ApproveExpense {
  constructor(
    private readonly expenses: ExpenseRepository,
    private readonly clock: Clock,
  ) {}

  async execute(actor: Actor, expenseId: string): Promise<void> {
    assertCan(actor, "expenses:approve");
    const expense = await findExpense(this.expenses, actor, expenseId);
    expense.approve(actor.userId, this.clock.now());
    await this.expenses.save(expense);
  }
}
