import { describe, expect, it } from "vitest";
import { clientsWithOne, sequentialIds } from "../testing/fakes";
import { InMemoryInvoiceRepository } from "../testing/in-memory-invoice-repository";
import { CreateInvoice } from "./create-invoice";
import { RecordPayment } from "./record-payment";
import { ValidateInvoice } from "./validate-invoice";

async function setup() {
  const repo = new InMemoryInvoiceRepository();
  const ids = sequentialIds();
  const clients = await clientsWithOne("co-1", "cl-1");
  const { id } = await new CreateInvoice(repo, clients, ids).execute({
    companyId: "co-1",
    clientId: "cl-1",
    amount: 3000,
    issueDate: new Date("2026-01-01"),
    dueDate: new Date("2026-01-31"),
  });
  await new ValidateInvoice(repo).execute({ companyId: "co-1", invoiceId: id });
  return { repo, id, recordPayment: new RecordPayment(repo, ids) };
}

describe("RecordPayment", () => {
  it("enregistre un paiement partiel", async () => {
    const { repo, id, recordPayment } = await setup();
    await recordPayment.execute({ companyId: "co-1", invoiceId: id, amount: 1000, date: new Date() });

    const invoice = await repo.byId("co-1", id);
    expect(invoice?.remainingAmount().toDinars()).toBe(2000);
  });

  it("refuse une facture d'une autre entreprise", async () => {
    const { id, recordPayment } = await setup();
    const payOther = recordPayment.execute({ companyId: "co-2", invoiceId: id, amount: 10, date: new Date() });

    await expect(payOther).rejects.toThrow("Facture introuvable.");
  });
});
