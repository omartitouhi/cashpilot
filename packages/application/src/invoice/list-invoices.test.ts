import { describe, expect, it } from "vitest";
import { finance, owner } from "../testing/actors";
import { clientsWithOne, fixedClock, sequentialIds } from "../testing/fakes";
import { InMemoryInvoiceRepository } from "../testing/in-memory-invoice-repository";
import { CreateInvoice } from "./create-invoice";
import { ListInvoices } from "./list-invoices";
import { ValidateInvoice } from "./validate-invoice";

describe("ListInvoices", () => {
  it("signale une facture validée dont l'échéance est passée", async () => {
    const repo = new InMemoryInvoiceRepository();
    const clients = await clientsWithOne("co-1", "cl-1");
    const { id } = await new CreateInvoice(repo, clients, sequentialIds()).execute(finance, {
      clientId: "cl-1",
      amount: 1500,
      issueDate: new Date("2026-01-01"),
      dueDate: new Date("2026-01-31"),
    });
    await new ValidateInvoice(repo).execute(finance, id);

    const list = await new ListInvoices(repo, fixedClock("2026-02-10")).execute(owner);

    expect(list).toHaveLength(1);
    expect(list[0]?.isOverdue).toBe(true);
    expect(list[0]?.remaining).toBe(1_500_000);
  });
});
