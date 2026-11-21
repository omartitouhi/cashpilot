import type { ClientRepository } from "../ports/client-repository";
import type { Clock } from "../ports/clock";
import type { CompanyRepository } from "../ports/company-repository";
import type { InvoicePdfRenderer } from "../ports/invoice-pdf-renderer";
import type { InvoiceRepository } from "../ports/invoice-repository";
import { assertCan, type Actor } from "../shared/actor";
import { NotFoundError } from "../shared/not-found-error";
import { findInvoice } from "./find-invoice";
import { toInvoiceView } from "./invoice-view";

/** Produit le PDF d'une facture de l'entreprise. */
export class ExportInvoicePdf {
  constructor(
    private readonly invoices: InvoiceRepository,
    private readonly clients: ClientRepository,
    private readonly companies: CompanyRepository,
    private readonly renderer: InvoicePdfRenderer,
    private readonly clock: Clock,
  ) {}

  async execute(actor: Actor, invoiceId: string): Promise<{ fileName: string; bytes: Uint8Array<ArrayBuffer> }> {
    assertCan(actor, "invoices:view");
    const invoice = toInvoiceView(await findInvoice(this.invoices, actor.companyId, invoiceId), this.clock.now());
    const [client, company] = await Promise.all([
      this.clients.byId(actor.companyId, invoice.clientId),
      this.companies.byId(actor.companyId),
    ]);
    if (!client || !company) throw new NotFoundError("Facture");

    const { name, email, phone } = client.snapshot();
    const bytes = await this.renderer.render({
      companyName: company.snapshot().name,
      client: { name, email, phone },
      invoice,
    });
    return { fileName: `facture-${invoice.number}.pdf`, bytes };
  }
}
