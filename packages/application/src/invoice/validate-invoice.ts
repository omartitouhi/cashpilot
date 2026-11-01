import type { InvoiceRepository } from "../ports/invoice-repository";
import { findInvoice } from "./find-invoice";

export type InvoiceRef = { companyId: string; invoiceId: string };

/** Fait passer un brouillon à l'état « validée ». */
export class ValidateInvoice {
  constructor(private readonly invoices: InvoiceRepository) {}

  async execute({ companyId, invoiceId }: InvoiceRef): Promise<void> {
    const invoice = await findInvoice(this.invoices, companyId, invoiceId);
    invoice.validate();
    await this.invoices.save(invoice);
  }
}
