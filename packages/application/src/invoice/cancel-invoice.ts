import type { InvoiceRepository } from "../ports/invoice-repository";
import { assertCan, type Actor } from "../shared/actor";
import { findInvoice } from "./find-invoice";

/** Annule une facture qui n'a reçu aucun paiement. */
export class CancelInvoice {
  constructor(private readonly invoices: InvoiceRepository) {}

  async execute(actor: Actor, invoiceId: string): Promise<void> {
    assertCan(actor, "invoices:manage");
    const invoice = await findInvoice(this.invoices, actor.companyId, invoiceId);
    invoice.cancel();
    await this.invoices.save(invoice);
  }
}
