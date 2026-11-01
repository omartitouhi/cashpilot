import { describe, expect, it } from "vitest";
import { sequentialIds } from "../testing/fakes";
import { InMemoryInvoiceRepository } from "../testing/in-memory-invoice-repository";
import { CreateInvoice } from "./create-invoice";

const input = {
  companyId: "co-1",
  clientId: "cl-1",
  amount: 3000,
  issueDate: new Date("2026-01-01"),
  dueDate: new Date("2026-01-31"),
};

describe("CreateInvoice", () => {
  it("enregistre une facture en brouillon", async () => {
    const repo = new InMemoryInvoiceRepository();
    const { id } = await new CreateInvoice(repo, sequentialIds()).execute(input);

    const invoice = await repo.byId("co-1", id);
    expect(invoice?.status).toBe("DRAFT");
  });

  it("numérote les factures à la suite", async () => {
    const repo = new InMemoryInvoiceRepository();
    const useCase = new CreateInvoice(repo, sequentialIds());
    await useCase.execute(input);
    const { id } = await useCase.execute(input);

    const invoice = await repo.byId("co-1", id);
    expect(invoice?.snapshot().number).toBe("F-0002");
  });
});
