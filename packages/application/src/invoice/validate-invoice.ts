import type { InvoiceRepository } from "../ports/invoice-repository";
import { assertCan, type Actor } from "../shared/actor";
import { findInvoice } from "./find-invoice";

/** Fait passer un brouillon à l'état « validée ». */
export class ValidateInvoice {
  constructor(private readonly invoices: InvoiceRepository) {}

  async execute(actor: Actor, invoiceId: string): Promise<void> {
    assertCan(actor, "invoices:manage");
    const invoice = await findInvoice(this.invoices, actor.companyId, invoiceId);
    invoice.validate();
    await this.invoices.save(invoice);
  }
}
