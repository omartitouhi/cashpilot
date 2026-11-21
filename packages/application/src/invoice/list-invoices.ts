import type { Clock } from "../ports/clock";
import type { InvoiceRepository } from "../ports/invoice-repository";
import { assertCan, type Actor } from "../shared/actor";
import { toInvoiceView, type InvoiceView } from "./invoice-view";

/** Liste les factures de l'entreprise, de la plus récente à la plus ancienne. */
export class ListInvoices {
  constructor(
    private readonly invoices: InvoiceRepository,
    private readonly clock: Clock,
  ) {}

  async execute(actor: Actor): Promise<InvoiceView[]> {
    assertCan(actor, "invoices:view");
    const today = this.clock.now();
    const invoices = await this.invoices.allForCompany(actor.companyId);
    return invoices
      .map((invoice) => toInvoiceView(invoice, today))
      .sort((a, b) => b.number.localeCompare(a.number));
  }
}
