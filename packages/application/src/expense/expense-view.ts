import type { Expense, ExpenseCategory, ExpenseStatus } from "@cashpilot/domain";

/** Une dépense prête à afficher : données simples et noms des personnes. */
export type ExpenseView = {
  id: string;
  label: string;
  category: ExpenseCategory;
  amount: number; // en millimes
  date: Date;
  status: ExpenseStatus;
  submitterName: string;
  supplierId: string | null;
  hasReceipt: boolean;
  decidedByName: string | null;
  decidedAt: Date | null;
  rejectionReason: string | null;
  paidByName: string | null;
  paidAt: Date | null;
};

export function toExpenseView(expense: Expense, names: Map<string, string>): ExpenseView {
  const data = expense.snapshot();
  const nameOf = (id: string | null) => (id ? (names.get(id) ?? "Ancien membre") : null);

  return {
    id: data.id,
    label: data.label,
    category: data.category,
    amount: data.amount.millimes,
    date: data.date,
    status: data.status,
    submitterName: nameOf(data.submittedBy) ?? "",
    supplierId: data.supplierId,
    hasReceipt: data.receiptId !== null,
    decidedByName: nameOf(data.decidedBy),
    decidedAt: data.decidedAt,
    rejectionReason: data.rejectionReason,
    paidByName: nameOf(data.paidBy),
    paidAt: data.paidAt,
  };
}
