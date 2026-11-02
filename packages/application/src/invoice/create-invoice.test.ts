import { describe, expect, it } from "vitest";
import { clientsWithOne, sequentialIds } from "../testing/fakes";
import { InMemoryInvoiceRepository } from "../testing/in-memory-invoice-repository";
import { CreateInvoice } from "./create-invoice";

const input = {
  companyId: "co-1",
  clientId: "cl-1",
  amount: 3000,
  issueDate: new Date("2026-01-01"),
  dueDate: new Date("2026-01-31"),
};

async function setup() {
  const repo = new InMemoryInvoiceRepository();
  const clients = await clientsWithOne("co-1", "cl-1");
  return { repo, createInvoice: new CreateInvoice(repo, clients, sequentialIds()) };
}

describe("CreateInvoice", () => {
  it("enregistre une facture en brouillon", async () => {
    const { repo, createInvoice } = await setup();
    const { id } = await createInvoice.execute(input);

    const invoice = await repo.byId("co-1", id);
    expect(invoice?.status).toBe("DRAFT");
  });

  it("numérote les factures à la suite", async () => {
    const { repo, createInvoice } = await setup();
    await createInvoice.execute(input);
    const { id } = await createInvoice.execute(input);

    const invoice = await repo.byId("co-1", id);
    expect(invoice?.snapshot().number).toBe("F-0002");
  });

  it("refuse un client d'une autre entreprise", async () => {
    const { createInvoice } = await setup();
    const otherCompany = createInvoice.execute({ ...input, companyId: "co-2" });

    await expect(otherCompany).rejects.toThrow("Client introuvable.");
  });
});
