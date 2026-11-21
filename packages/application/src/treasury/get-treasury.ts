import { withRunningBalance } from "@cashpilot/domain";
import type { CompanyRepository } from "../ports/company-repository";
import type { ExpenseRepository } from "../ports/expense-repository";
import type { InvoiceRepository } from "../ports/invoice-repository";
import { assertCan, type Actor } from "../shared/actor";
import { NotFoundError } from "../shared/not-found-error";
import { realizedMovements } from "./realized-movements";

/** Montants en millimes. */
export type TreasuryView = {
  initialBalance: number;
  balance: number;
  totalIn: number;
  totalOut: number;
  movements: { id: string; date: Date; label: string; amount: number; balanceAfter: number }[]; // plus récent d'abord
};

export class GetTreasury {
  constructor(
    private readonly companies: CompanyRepository,
    private readonly invoices: InvoiceRepository,
    private readonly expenses: ExpenseRepository,
  ) {}

  async execute(actor: Actor): Promise<TreasuryView> {
    assertCan(actor, "treasury:view");
    const [company, invoices, expenses] = await Promise.all([
      this.companies.byId(actor.companyId),
      this.invoices.allForCompany(actor.companyId),
      this.expenses.allForCompany(actor.companyId),
    ]);
    if (!company) throw new NotFoundError("Entreprise");

    const initial = company.snapshot().initialBalance;
    const history = withRunningBalance(initial, realizedMovements(invoices, expenses));
    const amounts = history.map((m) => m.amount.millimes);

    return {
      initialBalance: initial.millimes,
      balance: history.at(-1)?.balanceAfter.millimes ?? initial.millimes,
      totalIn: amounts.filter((a) => a > 0).reduce((sum, a) => sum + a, 0),
      totalOut: -amounts.filter((a) => a < 0).reduce((sum, a) => sum + a, 0),
      movements: history.reverse().map((m) => ({
        id: m.id,
        date: m.date,
        label: m.label,
        amount: m.amount.millimes,
        balanceAfter: m.balanceAfter.millimes,
      })),
    };
  }
}
