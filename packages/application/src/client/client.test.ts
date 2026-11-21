import { describe, expect, it } from "vitest";
import { ApproveExpense } from "../expense/approve-expense";
import { PayExpense } from "../expense/pay-expense";
import { SubmitExpense } from "../expense/submit-expense";
import { CreateInvoice } from "../invoice/create-invoice";
import { RecordPayment } from "../invoice/record-payment";
import { ValidateInvoice } from "../invoice/validate-invoice";
import { finance, member, otherCompany, owner } from "../testing/actors";
import { fixedClock, sequentialIds } from "../testing/fakes";
import { InMemoryClientRepository } from "../testing/in-memory-client-repository";
import { InMemoryExpenseRepository } from "../testing/in-memory-expense-repository";
import { InMemoryInvoiceRepository } from "../testing/in-memory-invoice-repository";
import { InMemoryReceiptStorage } from "../testing/in-memory-receipt-storage";
import { InMemoryUserRepository } from "../testing/in-memory-user-repository";
import { CreateClient } from "./create-client";
import { GetClient } from "./get-client";
import { ListClients } from "./list-clients";

async function setup() {
  const ids = sequentialIds();
  const clock = fixedClock("2026-01-15");
  const clients = new InMemoryClientRepository();
  const invoices = new InMemoryInvoiceRepository();
  const expenses = new InMemoryExpenseRepository();
  const create = new CreateClient(clients, ids);
  const contact = { email: null, phone: null };
  const { id: clientId } = await create.execute(finance, { kind: "CLIENT", name: "Le Fournil", ...contact });
  const { id: supplierId } = await create.execute(finance, { kind: "SUPPLIER", name: "Figma", ...contact });

  const dates = { issueDate: new Date("2026-01-01"), dueDate: new Date("2026-01-31") };
  const createInvoice = new CreateInvoice(invoices, clients, ids);
  const { id: issued } = await createInvoice.execute(finance, { clientId, amount: 3000, ...dates });
  await createInvoice.execute(finance, { clientId, amount: 999, ...dates }); // brouillon : non compté
  await new ValidateInvoice(invoices).execute(finance, issued);
  await new RecordPayment(invoices, ids).execute(finance, { invoiceId: issued, amount: 1000, date: new Date() });

  const submit = new SubmitExpense(expenses, new InMemoryReceiptStorage(), ids, clients);
  const expense = { label: "Licence", category: "SOFTWARE" as const, amount: 450, date: new Date(), receipt: null };
  const { id: expenseId } = await submit.execute(member, { ...expense, supplierId });
  await new ApproveExpense(expenses, clock).execute(owner, expenseId);
  await new PayExpense(expenses).execute(finance, { expenseId, paidAt: new Date() });

  const getClient = new GetClient(clients, invoices, expenses, new InMemoryUserRepository(), clock);
  return { clientId, supplierId, clients, invoices, submit, getClient };
}

describe("Clients et fournisseurs", () => {
  it("la fiche client montre l'historique et les totaux, hors brouillons", async () => {
    const { clientId, getClient } = await setup();
    const client = await getClient.execute(finance, clientId);
    expect(client.invoices).toHaveLength(2);
    expect(client.totalCommitted).toBe(3_000_000);
    expect(client.totalSettled).toBe(1_000_000);
  });

  it("la fiche fournisseur montre les dépenses payées", async () => {
    const { supplierId, getClient } = await setup();
    const supplier = await getClient.execute(owner, supplierId);
    expect(supplier.expenses).toHaveLength(1);
    expect(supplier.totalSettled).toBe(450_000);
  });

  it("on ne facture pas un fournisseur", async () => {
    const { supplierId, clients, invoices } = await setup();
    const dates = { issueDate: new Date("2026-01-01"), dueDate: new Date("2026-01-31") };
    const attempt = new CreateInvoice(invoices, clients, sequentialIds()).execute(finance, {
      clientId: supplierId, amount: 10, ...dates,
    });
    await expect(attempt).rejects.toThrow("Client introuvable.");
  });

  it("une dépense ne vise pas un client comme fournisseur", async () => {
    const { clientId, submit } = await setup();
    const expense = { label: "X", category: "OTHER" as const, amount: 1, date: new Date(), receipt: null };
    await expect(submit.execute(member, { ...expense, label: "Erreur", supplierId: clientId })).rejects.toThrow(
      "Fournisseur introuvable.",
    );
  });

  it("le collaborateur voit les fournisseurs mais pas les clients", async () => {
    const { clients } = await setup();
    const list = new ListClients(clients);
    expect(await list.execute(member, "SUPPLIER")).toHaveLength(1);
    await expect(list.execute(member, "CLIENT")).rejects.toThrow("droits");
  });

  it("une autre entreprise ne voit pas le client", async () => {
    const { clientId, getClient } = await setup();
    await expect(getClient.execute(otherCompany, clientId)).rejects.toThrow("Client introuvable.");
  });
});
