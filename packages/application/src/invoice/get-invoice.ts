import type { Clock } from "../ports/clock";
import type { InvoiceRepository } from "../ports/invoice-repository";
import { assertCan, type Actor } from "../shared/actor";
import { findInvoice } from "./find-invoice";
import { toInvoiceView, type InvoiceView } from "./invoice-view";

/** Renvoie une facture et ses paiements, prête à afficher. */
export class GetInvoice {
  constructor(
    private readonly invoices: InvoiceRepository,
    private readonly clock: Clock,
  ) {}

  async execute(actor: Actor, invoiceId: string): Promise<InvoiceView> {
    assertCan(actor, "invoices:view");
    const invoice = await findInvoice(this.invoices, actor.companyId, invoiceId);
    return toInvoiceView(invoice, this.clock.now());
  }
}
