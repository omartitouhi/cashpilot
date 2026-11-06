import { Money } from "@cashpilot/domain";
import type { IdGenerator } from "../ports/id-generator";
import type { InvoiceRepository } from "../ports/invoice-repository";
import { assertCan, type Actor } from "../shared/actor";
import { findInvoice } from "./find-invoice";

export type RecordPaymentInput = {
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

  async execute(actor: Actor, input: RecordPaymentInput): Promise<void> {
    assertCan(actor, "invoices:manage");
    const invoice = await findInvoice(this.invoices, actor.companyId, input.invoiceId);
    invoice.recordPayment({
      id: this.ids.next(),
      amount: Money.fromDinars(input.amount),
      date: input.date,
    });
    await this.invoices.save(invoice);
  }
}
