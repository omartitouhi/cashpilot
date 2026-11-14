import { Company, Money } from "@cashpilot/domain";
import { describe, expect, it } from "vitest";
import { ApproveExpense } from "../expense/approve-expense";
import { PayExpense } from "../expense/pay-expense";
import { RejectExpense } from "../expense/reject-expense";
import { SubmitExpense } from "../expense/submit-expense";
import { CreateInvoice } from "../invoice/create-invoice";
import { RecordPayment } from "../invoice/record-payment";
import { ValidateInvoice } from "../invoice/validate-invoice";
import { finance, member, owner } from "../testing/actors";
import { clientsWithOne, fixedClock, sequentialIds } from "../testing/fakes";
import { InMemoryCompanyRepository } from "../testing/in-memory-company-repository";
import { InMemoryExpenseRepository } from "../testing/in-memory-expense-repository";
import { InMemoryInvoiceRepository } from "../testing/in-memory-invoice-repository";
import { InMemoryReceiptStorage } from "../testing/in-memory-receipt-storage";
import { GetDashboard } from "./get-dashboard";
import { GetTreasury } from "./get-treasury";

/** Scénario : 5 000 DT au départ, facture de 3 000 payée 1 000, dépense de 450,5 payée. */
async function scenario() {
  const ids = sequentialIds();
  const clock = fixedClock("2026-03-01");
  const companies = new InMemoryCompanyRepository();
  const invoices = new InMemoryInvoiceRepository();
  const expenses = new InMemoryExpenseRepository();
  await companies.save(Company.create({ id: "co-1", name: "Pixel", initialBalance: Money.fromDinars(5000) }));

  const clients = await clientsWithOne("co-1", "cl-1");
  const { id: invoiceId } = await new CreateInvoice(invoices, clients, ids).execute(finance, {
    clientId: "cl-1", amount: 3000, issueDate: new Date("2026-02-01"), dueDate: new Date("2026-02-15"),
  });
  await new ValidateInvoice(invoices).execute(finance, invoiceId);
  await new RecordPayment(invoices, ids).execute(finance, { invoiceId, amount: 1000, date: new Date("2026-02-20") });

  const submit = new SubmitExpense(expenses, new InMemoryReceiptStorage(), ids, clients);
  const expense = { category: "SOFTWARE" as const, date: new Date("2026-03-05"), receipt: null };
  const paid = await submit.execute(member, { ...expense, label: "Figma", amount: 450.5 });
  await new ApproveExpense(expenses, clock).execute(owner, paid.id);
  await new PayExpense(expenses).execute(finance, { expenseId: paid.id, paidAt: new Date("2026-03-01") });
  const rejected = await submit.execute(member, { ...expense, label: "Écran", amount: 900 });
  await new RejectExpense(expenses, clock).execute(owner, rejected.id, "Pas nécessaire");
  await submit.execute(member, { ...expense, label: "Freelance", amount: 700 }); // en attente

  const treasury = new GetTreasury(companies, invoices, expenses);
  return { treasury, dashboard: new GetDashboard(treasury, invoices, expenses, clock) };
}

describe("Trésorerie", () => {
  it("ne compte que les opérations réalisées, une seule fois", async () => {
    const view = await (await scenario()).treasury.execute(owner);
    expect(view.balance).toBe(5_549_500); // 5 000 + 1 000 - 450,5
    expect(view.totalIn).toBe(1_000_000);
    expect(view.totalOut).toBe(450_500);
    expect(view.movements).toHaveLength(2);
  });

  it("le tableau de bord signale le retard et les dépenses à valider", async () => {
    const view = await (await scenario()).dashboard.execute(finance);
    expect(view.toCollect).toBe(2_000_000);
    expect(view.overdueInvoices).toHaveLength(1);
    expect(view.pendingExpenses.map((e) => e.label)).toEqual(["Freelance"]);
  });

  it("le collaborateur ne voit pas la trésorerie", async () => {
    await expect((await scenario()).treasury.execute(member)).rejects.toThrow("Vous n'avez pas les droits");
  });
});
