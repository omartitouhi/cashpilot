import { Money, type Expense, type ExpectedFlow, type Invoice } from "@cashpilot/domain";

/**
 * Les flux attendus mais pas encore réalisés :
 * - le RESTE à payer des factures validées, à leur échéance (les paiements reçus sont déjà dans le solde) ;
 * - les dépenses approuvées non payées, à leur date prévue.
 */
export function expectedFlows(invoices: Invoice[], expenses: Expense[]): ExpectedFlow[] {
  const incoming = invoices
    .filter((invoice) => invoice.status === "ISSUED")
    .map((invoice) => {
      const { id, number, dueDate } = invoice.snapshot();
      return { id, label: `Facture ${number}`, date: dueDate, amount: invoice.remainingAmount() };
    });

  const outgoing = expenses
    .filter((expense) => expense.status === "APPROVED")
    .map((expense) => {
      const { id, label, date, amount } = expense.snapshot();
      return { id, label, date, amount: Money.zero().subtract(amount) };
    });

  return [...incoming, ...outgoing];
}
