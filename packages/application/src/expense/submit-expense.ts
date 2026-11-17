import { Expense, Money, type ExpenseCategory } from "@cashpilot/domain";
import type { ClientRepository } from "../ports/client-repository";
import type { ExpenseRepository } from "../ports/expense-repository";
import type { ProjectRepository } from "../ports/project-repository";
import { findProject } from "../project/find-project";
import { NotFoundError } from "../shared/not-found-error";
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
  supplierId?: string | null;
  projectId?: string | null;
};

/** Un membre soumet une dépense, avec un justificatif facultatif. */
export class SubmitExpense {
  constructor(
    private readonly expenses: ExpenseRepository,
    private readonly receipts: ReceiptStorage,
    private readonly ids: IdGenerator,
    private readonly suppliers: ClientRepository,
    private readonly projects: ProjectRepository,
  ) {}

  async execute(actor: Actor, input: SubmitExpenseInput): Promise<{ id: string }> {
    assertCan(actor, "expenses:submit");
    if (input.receipt) assertValidReceipt(input.receipt);
    const supplierId = input.supplierId ?? null;
    if (supplierId) {
      const supplier = await this.suppliers.byId(actor.companyId, supplierId);
      if (supplier?.kind !== "SUPPLIER") throw new NotFoundError("Fournisseur");
    }
    const projectId = input.projectId ?? null;
    if (projectId) await findProject(this.projects, actor.companyId, projectId);

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
      supplierId,
      projectId,
    });

    if (input.receipt) {
      const receiptId = await this.receipts.save(actor.companyId, input.receipt);
      expense.attachReceipt(receiptId);
    }
    await this.expenses.save(expense);
    return { id: expense.id };
  }
}
