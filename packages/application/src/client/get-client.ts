import type { Clock } from "../ports/clock";
import type { ClientRepository } from "../ports/client-repository";
import type { InvoiceRepository } from "../ports/invoice-repository";
import { assertCan, type Actor } from "../shared/actor";
import { NotFoundError } from "../shared/not-found-error";
import { toInvoiceView, type InvoiceView } from "../invoice/invoice-view";
import type { ClientView } from "./list-clients";

/** Une fiche client : coordonnées, factures et totaux (en millimes). */
export type ClientDetailView = ClientView & {
  invoices: InvoiceView[];
  totalBilled: number; // hors brouillons et factures annulées
  totalPaid: number;
};

export class GetClient {
  constructor(
    private readonly clients: ClientRepository,
    private readonly invoices: InvoiceRepository,
    private readonly clock: Clock,
  ) {}

  async execute(actor: Actor, clientId: string): Promise<ClientDetailView> {
    assertCan(actor, "invoices:view");
    const client = await this.clients.byId(actor.companyId, clientId);
    if (!client) throw new NotFoundError("Client");

    const today = this.clock.now();
    const invoices = (await this.invoices.allForCompany(actor.companyId))
      .filter((invoice) => invoice.snapshot().clientId === clientId)
      .map((invoice) => toInvoiceView(invoice, today))
      .sort((a, b) => b.number.localeCompare(a.number));
    const billed = invoices.filter((i) => i.status === "ISSUED" || i.status === "PAID");

    return {
      ...client.snapshot(),
      invoices,
      totalBilled: billed.reduce((sum, i) => sum + i.amount, 0),
      totalPaid: billed.reduce((sum, i) => sum + i.paid, 0),
    };
  }
}
