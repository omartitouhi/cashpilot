import type { Expense } from "@cashpilot/domain";

export interface ExpenseRepository {
  save(expense: Expense): Promise<void>;
  byId(companyId: string, id: string): Promise<Expense | null>;
  allForCompany(companyId: string): Promise<Expense[]>;
}
