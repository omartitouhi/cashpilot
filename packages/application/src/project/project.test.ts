import { Client } from "@cashpilot/domain";
import { describe, expect, it } from "vitest";
import { ApproveExpense } from "../expense/approve-expense";
import { SubmitExpense } from "../expense/submit-expense";
import { CreateInvoice } from "../invoice/create-invoice";
import { ValidateInvoice } from "../invoice/validate-invoice";
import { finance, member, owner } from "../testing/actors";
import { clientsWithOne, fixedClock, sequentialIds } from "../testing/fakes";
import { InMemoryExpenseRepository } from "../testing/in-memory-expense-repository";
import { InMemoryInvoiceRepository } from "../testing/in-memory-invoice-repository";
import { InMemoryProjectRepository } from "../testing/in-memory-project-repository";
import { InMemoryReceiptStorage } from "../testing/in-memory-receipt-storage";
import { CreateProject } from "./create-project";
import { ListProjects } from "./list-projects";

async function setup() {
  const ids = sequentialIds();
  const clients = await clientsWithOne("co-1", "cl-1");
  await clients.save(Client.create({ id: "cl-2", companyId: "co-1", kind: "CLIENT", name: "Autre", email: null, phone: null }));
  const projects = new InMemoryProjectRepository();
  const invoices = new InMemoryInvoiceRepository();
  const expenses = new InMemoryExpenseRepository();
  const { id: projectId } = await new CreateProject(projects, clients, ids).execute(finance, {
    name: "Site vitrine", clientId: "cl-1",
  });
  return {
    projectId,
    createInvoice: new CreateInvoice(invoices, clients, ids, projects),
    submit: new SubmitExpense(expenses, new InMemoryReceiptStorage(), ids, clients, projects),
    validate: new ValidateInvoice(invoices),
    approve: new ApproveExpense(expenses, fixedClock("2026-01-10")),
    list: new ListProjects(projects, invoices, expenses),
  };
}

const dates = { issueDate: new Date("2026-01-01"), dueDate: new Date("2026-01-31") };
const expense = { category: "FREELANCE" as const, date: new Date("2026-01-15"), receipt: null };

describe("Rentabilité par projet", () => {
  it("chiffre d'affaires validé - coûts approuvés = marge", async () => {
    const uc = await setup();
    const { id } = await uc.createInvoice.execute(finance, { clientId: "cl-1", projectId: uc.projectId, amount: 5000, ...dates });
    await uc.validate.execute(finance, id);
    await uc.createInvoice.execute(finance, { clientId: "cl-1", projectId: uc.projectId, amount: 999, ...dates }); // brouillon
    const { id: e1 } = await uc.submit.execute(member, { ...expense, label: "Dev", amount: 2000, projectId: uc.projectId });
    await uc.approve.execute(owner, e1);
    await uc.submit.execute(member, { ...expense, label: "En attente", amount: 500, projectId: uc.projectId });

    const [project] = await uc.list.execute(owner);
    expect(project?.revenue).toBe(5_000_000);
    expect(project?.costs).toBe(2_000_000);
    expect(project?.margin).toBe(3_000_000);
    expect(project?.marginRate).toBe(60);
  });

  it("refuse de facturer un projet à un autre client", async () => {
    const uc = await setup();
    const attempt = uc.createInvoice.execute(finance, { clientId: "cl-2", projectId: uc.projectId, amount: 10, ...dates });
    await expect(attempt).rejects.toThrow("Ce projet appartient à un autre client.");
  });

  it("le collaborateur ne voit pas les marges", async () => {
    const uc = await setup();
    await expect(uc.list.execute(member)).rejects.toThrow("droits");
  });
});
