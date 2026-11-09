import { can, type Expense } from "@cashpilot/domain";
import type { ExpenseRepository } from "../ports/expense-repository";
import type { Actor } from "../shared/actor";
import { NotFoundError } from "../shared/not-found-error";

/** Un collaborateur ne voit que ses dépenses ; dirigeant et finance voient tout. */
export function canSeeExpense(actor: Actor, expense: Expense): boolean {
  return can(actor.role, "expenses:view-all") || expense.snapshot().submittedBy === actor.userId;
}

/** Charge une dépense visible par l'utilisateur, ou lève une erreur. */
export async function findExpense(expenses: ExpenseRepository, actor: Actor, id: string): Promise<Expense> {
  const expense = await expenses.byId(actor.companyId, id);
  if (!expense || !canSeeExpense(actor, expense)) throw new NotFoundError("Dépense");
  return expense;
}
