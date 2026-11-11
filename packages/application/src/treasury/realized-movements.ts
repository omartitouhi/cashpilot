import { Money, type Expense, type Invoice, type Movement } from "@cashpilot/domain";

/**
 * Les opérations réalisées : paiements reçus (+) et dépenses payées (-).
 * Elles sont lues depuis les factures et les dépenses, sans copie :
 * une opération ne peut donc pas être comptée deux fois.
 */
export function realizedMovements(invoices: Invoice[], expenses: Expense[]): Movement[] {
  const received = invoices.flatMap((invoice) => {
    const { number, payments } = invoice.snapshot();
    return payments.map((p) => ({ id: p.id, date: p.date, label: `Encaissement ${number}`, amount: p.amount }));
  });

  const paid = expenses
    .map((expense) => expense.snapshot())
    .filter((e) => e.status === "PAID")
    .map((e) => ({ id: e.id, date: e.paidAt ?? e.date, label: e.label, amount: Money.zero().subtract(e.amount) }));

  return [...received, ...paid];
}
