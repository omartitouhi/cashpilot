import type { ExpenseRepository } from "@cashpilot/application";
import { prisma, type Expense as ExpenseRow } from "@cashpilot/db";
import { Expense, Money } from "@cashpilot/domain";

function toDomain(row: ExpenseRow): Expense {
  const { createdAt, amount, ...rest } = row;
  return Expense.restore({ ...rest, amount: Money.fromDinars(amount.toNumber()) });
}

export class PrismaExpenseRepository implements ExpenseRepository {
  async save(expense: Expense): Promise<void> {
    const { amount, ...rest } = expense.snapshot();
    const data = { ...rest, amount: amount.toDinars() };
    await prisma.expense.upsert({ where: { id: data.id }, create: data, update: data });
  }

  async byId(companyId: string, id: string): Promise<Expense | null> {
    const row = await prisma.expense.findFirst({ where: { id, companyId } });
    return row ? toDomain(row) : null;
  }

  async allForCompany(companyId: string): Promise<Expense[]> {
    const rows = await prisma.expense.findMany({ where: { companyId } });
    return rows.map(toDomain);
  }
}
