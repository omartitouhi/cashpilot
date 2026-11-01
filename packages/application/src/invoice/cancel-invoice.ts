import type { InvoiceRepository } from "../ports/invoice-repository";
import { findInvoice } from "./find-invoice";
import type { InvoiceRef } from "./validate-invoice";

/** Annule une facture qui n'a reçu aucun paiement. */
export class CancelInvoice {
  constructor(private readonly invoices: InvoiceRepository) {}

  async execute({ companyId, invoiceId }: InvoiceRef): Promise<void> {
    const invoice = await findInvoice(this.invoices, companyId, invoiceId);
    invoice.cancel();
    await this.invoices.save(invoice);
  }
}
