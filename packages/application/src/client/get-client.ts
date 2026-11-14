import type { ClientRepository } from "../ports/client-repository";
import type { Clock } from "../ports/clock";
import type { ExpenseRepository } from "../ports/expense-repository";
import type { InvoiceRepository } from "../ports/invoice-repository";
import type { UserRepository } from "../ports/user-repository";
import { assertCan, type Actor } from "../shared/actor";
import { NotFoundError } from "../shared/not-found-error";
import { userNames } from "../shared/user-names";
import { toExpenseView, type ExpenseView } from "../expense/expense-view";
import { toInvoiceView, type InvoiceView } from "../invoice/invoice-view";
import type { ClientView } from "./list-clients";

/**
 * Fiche d'un tiers, montants en millimes.
 * Client : factures validées (engagé) et encaissées (réglé).
 * Fournisseur : dépenses approuvées ou payées (engagé) et payées (réglé).
 */
export type ClientDetailView = ClientView & {
  invoices: InvoiceView[];
  expenses: ExpenseView[];
  totalCommitted: number;
  totalSettled: number;
};

export class GetClient {
  constructor(
    private readonly clients: ClientRepository,
    private readonly invoices: InvoiceRepository,
    private readonly expenses: ExpenseRepository,
    private readonly users: UserRepository,
    private readonly clock: Clock,
  ) {}

  async execute(actor: Actor, clientId: string): Promise<ClientDetailView> {
    const client = await this.clients.byId(actor.companyId, clientId);
    assertCan(actor, client?.kind === "SUPPLIER" ? "expenses:view-all" : "invoices:view");
    if (!client) throw new NotFoundError("Client");

    return client.kind === "CLIENT"
      ? { ...client.snapshot(), ...(await this.invoiceHistory(actor, clientId)), expenses: [] }
      : { ...client.snapshot(), ...(await this.expenseHistory(actor, clientId)), invoices: [] };
  }

  private async invoiceHistory(actor: Actor, clientId: string) {
    const today = this.clock.now();
    const invoices = (await this.invoices.allForCompany(actor.companyId))
      .filter((invoice) => invoice.snapshot().clientId === clientId)
      .map((invoice) => toInvoiceView(invoice, today))
      .sort((a, b) => b.number.localeCompare(a.number));
    const issued = invoices.filter((i) => i.status === "ISSUED" || i.status === "PAID");
    return {
      invoices,
      totalCommitted: issued.reduce((sum, i) => sum + i.amount, 0),
      totalSettled: issued.reduce((sum, i) => sum + i.paid, 0),
    };
  }

  private async expenseHistory(actor: Actor, supplierId: string) {
    const [all, names] = await Promise.all([
      this.expenses.allForCompany(actor.companyId),
      userNames(this.users, actor.companyId),
    ]);
    const expenses = all
      .filter((e) => e.snapshot().supplierId === supplierId)
      .map((e) => toExpenseView(e, names))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
    const committed = expenses.filter((e) => e.status === "APPROVED" || e.status === "PAID");
    return {
      expenses,
      totalCommitted: committed.reduce((sum, e) => sum + e.amount, 0),
      totalSettled: committed.filter((e) => e.status === "PAID").reduce((sum, e) => sum + e.amount, 0),
    };
  }
}
