import type { Clock } from "../ports/clock";
import type { InvoiceRepository } from "../ports/invoice-repository";
import { toInvoiceView, type InvoiceView } from "./invoice-view";

/** Liste les factures d'une entreprise, de la plus récente à la plus ancienne. */
export class ListInvoices {
  constructor(
    private readonly invoices: InvoiceRepository,
    private readonly clock: Clock,
  ) {}

  async execute(companyId: string): Promise<InvoiceView[]> {
    const today = this.clock.now();
    const invoices = await this.invoices.allForCompany(companyId);
    return invoices
      .map((invoice) => toInvoiceView(invoice, today))
      .sort((a, b) => b.number.localeCompare(a.number));
  }
}
