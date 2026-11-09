import type { ExpenseRepository } from "../ports/expense-repository";
import type { ReceiptFile, ReceiptStorage } from "../ports/receipt-storage";
import type { Actor } from "../shared/actor";
import { NotFoundError } from "../shared/not-found-error";
import { findExpense } from "./find-expense";

/** Le justificatif d'une dépense, pour ceux qui peuvent voir la dépense. */
export class GetReceipt {
  constructor(
    private readonly expenses: ExpenseRepository,
    private readonly receipts: ReceiptStorage,
  ) {}

  async execute(actor: Actor, expenseId: string): Promise<ReceiptFile> {
    const expense = await findExpense(this.expenses, actor, expenseId);
    const { receiptId } = expense.snapshot();
    const file = receiptId ? await this.receipts.read(actor.companyId, receiptId) : null;
    if (!file) throw new NotFoundError("Justificatif");
    return file;
  }
}
