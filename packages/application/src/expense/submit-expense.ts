import { Expense, Money, type ExpenseCategory } from "@cashpilot/domain";
import type { ExpenseRepository } from "../ports/expense-repository";
import type { IdGenerator } from "../ports/id-generator";
import type { ReceiptFile, ReceiptStorage } from "../ports/receipt-storage";
import { assertCan, type Actor } from "../shared/actor";
import { assertValidReceipt } from "./receipt-rules";

export type SubmitExpenseInput = {
  label: string;
  category: ExpenseCategory;
  amount: number; // en dinars
  date: Date;
  receipt: ReceiptFile | null;
};

/** Un membre soumet une dépense, avec un justificatif facultatif. */
export class SubmitExpense {
  constructor(
    private readonly expenses: ExpenseRepository,
    private readonly receipts: ReceiptStorage,
    private readonly ids: IdGenerator,
  ) {}

  async execute(actor: Actor, input: SubmitExpenseInput): Promise<{ id: string }> {
    assertCan(actor, "expenses:submit");
    if (input.receipt) assertValidReceipt(input.receipt);

    // On valide la dépense AVANT d'enregistrer le fichier.
    const expense = Expense.submit({
      id: this.ids.next(),
      companyId: actor.companyId,
      submittedBy: actor.userId,
      label: input.label,
      category: input.category,
      amount: Money.fromDinars(input.amount),
      date: input.date,
      receiptId: null,
    });

    if (input.receipt) {
      const receiptId = await this.receipts.save(actor.companyId, input.receipt);
      expense.attachReceipt(receiptId);
    }
    await this.expenses.save(expense);
    return { id: expense.id };
  }
}
