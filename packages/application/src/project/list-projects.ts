import { profitability } from "@cashpilot/domain";
import type { ExpenseRepository } from "../ports/expense-repository";
import type { InvoiceRepository } from "../ports/invoice-repository";
import type { ProjectRepository } from "../ports/project-repository";
import { assertCan, type Actor } from "../shared/actor";

/** Un projet et sa rentabilité. Montants en millimes. */
export type ProjectView = {
  id: string;
  name: string;
  clientId: string;
  revenue: number; // factures validées ou payées
  costs: number; // dépenses approuvées ou payées
  margin: number;
  marginRate: number | null; // en %
};

export class ListProjects {
  constructor(
    private readonly projects: ProjectRepository,
    private readonly invoices: InvoiceRepository,
    private readonly expenses: ExpenseRepository,
  ) {}

  async execute(actor: Actor): Promise<ProjectView[]> {
    assertCan(actor, "invoices:view");
    const [projects, invoices, expenses] = await Promise.all([
      this.projects.allForCompany(actor.companyId),
      this.invoices.allForCompany(actor.companyId),
      this.expenses.allForCompany(actor.companyId),
    ]);

    return projects.map((project) => {
      const { id, name, clientId } = project.snapshot();
      const revenues = invoices
        .map((i) => i.snapshot())
        .filter((i) => i.projectId === id && (i.status === "ISSUED" || i.status === "PAID"))
        .map((i) => i.amount);
      const costs = expenses
        .map((e) => e.snapshot())
        .filter((e) => e.projectId === id && (e.status === "APPROVED" || e.status === "PAID"))
        .map((e) => e.amount);
      const result = profitability(revenues, costs);
      return {
        id, name, clientId,
        revenue: result.revenue.millimes,
        costs: result.costs.millimes,
        margin: result.margin.millimes,
        marginRate: result.marginRate,
      };
    });
  }
}
