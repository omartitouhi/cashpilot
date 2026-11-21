import type { ExpenseRepository } from "../ports/expense-repository";
import type { UserRepository } from "../ports/user-repository";
import { assertCan, type Actor } from "../shared/actor";
import { userNames } from "../shared/user-names";
import { toExpenseView, type ExpenseView } from "./expense-view";
import { canSeeExpense } from "./find-expense";

/** Les dépenses visibles par l'utilisateur, les plus récentes d'abord. */
export class ListExpenses {
  constructor(
    private readonly expenses: ExpenseRepository,
    private readonly users: UserRepository,
  ) {}

  async execute(actor: Actor): Promise<ExpenseView[]> {
    assertCan(actor, "expenses:submit");
    const [all, names] = await Promise.all([
      this.expenses.allForCompany(actor.companyId),
      userNames(this.users, actor.companyId),
    ]);
    return all
      .filter((expense) => canSeeExpense(actor, expense))
      .map((expense) => toExpenseView(expense, names))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}
