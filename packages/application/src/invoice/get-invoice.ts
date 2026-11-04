import type { Clock } from "../ports/clock";
import type { InvoiceRepository } from "../ports/invoice-repository";
import { findInvoice } from "./find-invoice";
import { toInvoiceView, type InvoiceView } from "./invoice-view";
import type { InvoiceRef } from "./validate-invoice";

/** Renvoie une facture et ses paiements, prête à afficher. */
export class GetInvoice {
  constructor(
    private readonly invoices: InvoiceRepository,
    private readonly clock: Clock,
  ) {}

  async execute({ companyId, invoiceId }: InvoiceRef): Promise<InvoiceView> {
    const invoice = await findInvoice(this.invoices, companyId, invoiceId);
    return toInvoiceView(invoice, this.clock.now());
  }
}
