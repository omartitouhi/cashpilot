import type { Clock } from "../ports/clock";
import type { IdGenerator } from "../ports/id-generator";
import type { InvoiceRepository } from "../ports/invoice-repository";
import { assertCan, type Actor } from "../shared/actor";
import { findInvoice } from "./find-invoice";

export type ReversePaymentInput = { invoiceId: string; paymentId: string; reason: string };

/** Annule un paiement saisi par erreur, par une opération inverse traçable. */
export class ReversePayment {
  constructor(
    private readonly invoices: InvoiceRepository,
    private readonly ids: IdGenerator,
    private readonly clock: Clock,
  ) {}

  async execute(actor: Actor, input: ReversePaymentInput): Promise<void> {
    assertCan(actor, "invoices:manage");
    const invoice = await findInvoice(this.invoices, actor.companyId, input.invoiceId);
    invoice.reversePayment(input.paymentId, { id: this.ids.next(), date: this.clock.now(), reason: input.reason });
    await this.invoices.save(invoice);
  }
}
