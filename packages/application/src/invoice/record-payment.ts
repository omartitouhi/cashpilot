import { Money } from "@cashpilot/domain";
import type { IdGenerator } from "../ports/id-generator";
import type { InvoiceRepository } from "../ports/invoice-repository";
import { findInvoice } from "./find-invoice";

export type RecordPaymentInput = {
  companyId: string;
  invoiceId: string;
  amount: number; // en dinars
  date: Date;
};

/** Enregistre un encaissement, total ou partiel, sur une facture. */
export class RecordPayment {
  constructor(
    private readonly invoices: InvoiceRepository,
    private readonly ids: IdGenerator,
  ) {}

  async execute(input: RecordPaymentInput): Promise<void> {
    const invoice = await findInvoice(this.invoices, input.companyId, input.invoiceId);
    invoice.recordPayment({
      id: this.ids.next(),
      amount: Money.fromDinars(input.amount),
      date: input.date,
    });
    await this.invoices.save(invoice);
  }
}
