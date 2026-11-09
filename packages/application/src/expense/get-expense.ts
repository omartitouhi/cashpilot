import type { ExpenseRepository } from "../ports/expense-repository";
import type { UserRepository } from "../ports/user-repository";
import type { Actor } from "../shared/actor";
import { userNames } from "../shared/user-names";
import { toExpenseView, type ExpenseView } from "./expense-view";
import { findExpense } from "./find-expense";

export class GetExpense {
  constructor(
    private readonly expenses: ExpenseRepository,
    private readonly users: UserRepository,
  ) {}

  async execute(actor: Actor, expenseId: string): Promise<ExpenseView> {
    const expense = await findExpense(this.expenses, actor, expenseId);
    const names = await userNames(this.users, actor.companyId);
    return toExpenseView(expense, names);
  }
}
