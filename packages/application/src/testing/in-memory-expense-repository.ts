import type { Expense } from "@cashpilot/domain";
import type { ExpenseRepository } from "../ports/expense-repository";

/** Repository de dépenses en mémoire, pour les tests. */
export class InMemoryExpenseRepository implements ExpenseRepository {
  private readonly items = new Map<string, Expense>();

  async save(expense: Expense): Promise<void> {
    this.items.set(expense.id, expense);
  }

  async byId(companyId: string, id: string): Promise<Expense | null> {
    const expense = this.items.get(id);
    return expense?.snapshot().companyId === companyId ? expense : null;
  }

  async allForCompany(companyId: string): Promise<Expense[]> {
    return [...this.items.values()].filter((e) => e.snapshot().companyId === companyId);
  }
}
