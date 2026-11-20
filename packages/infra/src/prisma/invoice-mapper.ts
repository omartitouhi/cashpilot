import type { Invoice as InvoiceRow, Payment as PaymentRow } from "@cashpilot/db";
import { Invoice, Money } from "@cashpilot/domain";

type InvoiceRowWithPayments = InvoiceRow & { payments: PaymentRow[] };

/** Traduit une facture entre la base de données et le domaine. */
export const InvoiceMapper = {
  toDomain(row: InvoiceRowWithPayments): Invoice {
    return Invoice.restore({
      id: row.id,
      companyId: row.companyId,
      clientId: row.clientId,
      number: row.number,
      amount: Money.fromDinars(row.amount.toNumber()),
      issueDate: row.issueDate,
      dueDate: row.dueDate,
      status: row.status,
      payments: row.payments.map((p) => ({
        id: p.id,
        amount: Money.fromDinars(p.amount.toNumber()),
        date: p.date,
      })),
    });
  },

  toRow(invoice: Invoice) {
    const data = invoice.snapshot();
    return {
      id: data.id,
      companyId: data.companyId,
      clientId: data.clientId,
      number: data.number,
      amount: data.amount.toDinars(),
      issueDate: data.issueDate,
      dueDate: data.dueDate,
      status: data.status,
    };
  },

  toPaymentRows(invoice: Invoice) {
    return invoice.snapshot().payments.map((p) => ({
      id: p.id,
      invoiceId: invoice.id,
      amount: p.amount.toDinars(),
      date: p.date,
    }));
  },
};
