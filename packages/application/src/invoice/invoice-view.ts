import type { Invoice, InvoiceStatus } from "@cashpilot/domain";

/** Une facture prête à afficher : uniquement des données simples. */
export type InvoiceView = {
  id: string;
  number: string;
  clientId: string;
  status: InvoiceStatus;
  amount: number; // en millimes
  paid: number; // en millimes
  remaining: number; // en millimes
  issueDate: Date;
  dueDate: Date;
  isOverdue: boolean;
};

export function toInvoiceView(invoice: Invoice, today: Date): InvoiceView {
  const data = invoice.snapshot();
  return {
    id: data.id,
    number: data.number,
    clientId: data.clientId,
    status: data.status,
    amount: data.amount.millimes,
    paid: invoice.paidAmount().millimes,
    remaining: invoice.remainingAmount().millimes,
    issueDate: data.issueDate,
    dueDate: data.dueDate,
    isOverdue: invoice.isOverdue(today),
  };
}
