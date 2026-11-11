import type { Clock } from "../ports/clock";
import type { ExpenseRepository } from "../ports/expense-repository";
import type { InvoiceRepository } from "../ports/invoice-repository";
import type { Actor } from "../shared/actor";
import type { GetTreasury } from "./get-treasury";

/** Indicateurs et alertes du tableau de bord. Montants en millimes. */
export type DashboardView = {
  balance: number;
  toCollect: number; // reste à encaisser sur les factures validées
  overdueInvoices: { id: string; number: string; remaining: number; dueDate: Date }[];
  pendingExpenses: { id: string; label: string; amount: number }[]; // à valider
};

export class GetDashboard {
  constructor(
    private readonly treasury: GetTreasury, // vérifie aussi la permission
    private readonly invoices: InvoiceRepository,
    private readonly expenses: ExpenseRepository,
    private readonly clock: Clock,
  ) {}

  async execute(actor: Actor): Promise<DashboardView> {
    const { balance } = await this.treasury.execute(actor);
    const today = this.clock.now();
    const [invoices, expenses] = await Promise.all([
      this.invoices.allForCompany(actor.companyId),
      this.expenses.allForCompany(actor.companyId),
    ]);

    const issued = invoices.filter((i) => i.status === "ISSUED");
    return {
      balance,
      toCollect: issued.reduce((sum, i) => sum + i.remainingAmount().millimes, 0),
      overdueInvoices: issued
        .filter((i) => i.isOverdue(today))
        .map((i) => ({ id: i.id, number: i.snapshot().number, remaining: i.remainingAmount().millimes, dueDate: i.snapshot().dueDate })),
      pendingExpenses: expenses
        .filter((e) => e.status === "SUBMITTED")
        .map((e) => ({ id: e.id, label: e.snapshot().label, amount: e.snapshot().amount.millimes })),
    };
  }
}
