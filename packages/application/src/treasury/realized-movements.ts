import { Money, type Expense, type Invoice, type Movement } from "@cashpilot/domain";

/**
 * Les opérations réalisées : paiements reçus (+) et dépenses payées (-).
 * Elles sont lues depuis les factures et les dépenses, sans copie :
 * une opération ne peut donc pas être comptée deux fois.
 */
export function realizedMovements(invoices: Invoice[], expenses: Expense[]): Movement[] {
  const received = invoices.flatMap((invoice) => {
    const { number, payments } = invoice.snapshot();
    return payments.map((p) => ({
      id: p.id,
      date: p.date,
      label: p.reversalOf ? `Correction ${number} : ${p.reason}` : `Encaissement ${number}`,
      amount: p.amount,
      direction: "IN" as const,
    }));
  });

  const paid = expenses.flatMap((expense): Movement[] => {
    const e = expense.snapshot();
    const out = Money.zero().subtract(e.amount);
    const movements: Movement[] = [];
    // Un paiement corrigé apparaît deux fois : le paiement d'origine, puis son annulation.
    if (e.reversedPaidAt && e.reversedAt) {
      movements.push({ id: `${e.id}-paiement-annule`, date: e.reversedPaidAt, label: e.label, amount: out, direction: "OUT" });
      movements.push({
        id: `${e.id}-correction`, date: e.reversedAt, label: `Correction ${e.label} : ${e.reversalReason}`,
        amount: e.amount, direction: "OUT",
      });
    }
    if (e.status === "PAID") {
      movements.push({ id: e.id, date: e.paidAt ?? e.date, label: e.label, amount: out, direction: "OUT" });
    }
    return movements;
  });

  return [...received, ...paid];
}
