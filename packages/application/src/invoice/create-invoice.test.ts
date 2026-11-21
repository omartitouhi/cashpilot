import { InMemoryProjectRepository } from "../testing/in-memory-project-repository";
import { describe, expect, it } from "vitest";
import { finance, member, otherCompany } from "../testing/actors";
import { clientsWithOne, sequentialIds } from "../testing/fakes";
import { InMemoryInvoiceRepository } from "../testing/in-memory-invoice-repository";
import { CreateInvoice } from "./create-invoice";

const input = {
  clientId: "cl-1",
  amount: 3000,
  issueDate: new Date("2026-01-01"),
  dueDate: new Date("2026-01-31"),
};

async function setup() {
  const repo = new InMemoryInvoiceRepository();
  const clients = await clientsWithOne("co-1", "cl-1");
  return { repo, createInvoice: new CreateInvoice(repo, clients, sequentialIds(), new InMemoryProjectRepository()) };
}

describe("CreateInvoice", () => {
  it("enregistre une facture en brouillon", async () => {
    const { repo, createInvoice } = await setup();
    const { id } = await createInvoice.execute(finance, input);

    const invoice = await repo.byId("co-1", id);
    expect(invoice?.status).toBe("DRAFT");
  });

  it("numérote les factures à la suite", async () => {
    const { repo, createInvoice } = await setup();
    await createInvoice.execute(finance, input);
    const { id } = await createInvoice.execute(finance, input);

    const invoice = await repo.byId("co-1", id);
    expect(invoice?.snapshot().number).toBe("F-0002");
  });

  it("refuse un client d'une autre entreprise", async () => {
    const { createInvoice } = await setup();
    await expect(createInvoice.execute(otherCompany, input)).rejects.toThrow("Client introuvable.");
  });

  it("refuse un collaborateur", async () => {
    const { createInvoice } = await setup();
    await expect(createInvoice.execute(member, input)).rejects.toThrow("Vous n'avez pas les droits");
  });
});
