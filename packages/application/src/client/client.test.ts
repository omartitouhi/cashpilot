import { describe, expect, it } from "vitest";
import { CreateInvoice } from "../invoice/create-invoice";
import { RecordPayment } from "../invoice/record-payment";
import { ValidateInvoice } from "../invoice/validate-invoice";
import { finance, member, otherCompany } from "../testing/actors";
import { fixedClock, sequentialIds } from "../testing/fakes";
import { InMemoryClientRepository } from "../testing/in-memory-client-repository";
import { InMemoryInvoiceRepository } from "../testing/in-memory-invoice-repository";
import { CreateClient } from "./create-client";
import { GetClient } from "./get-client";

async function setup() {
  const ids = sequentialIds();
  const clients = new InMemoryClientRepository();
  const invoices = new InMemoryInvoiceRepository();
  const { id: clientId } = await new CreateClient(clients, ids).execute(finance, {
    name: "Le Fournil", email: "contact@fournil.tn", phone: null,
  });
  const dates = { issueDate: new Date("2026-01-01"), dueDate: new Date("2026-01-31") };
  const createInvoice = new CreateInvoice(invoices, clients, ids);
  const { id: issued } = await createInvoice.execute(finance, { clientId, amount: 3000, ...dates });
  await createInvoice.execute(finance, { clientId, amount: 999, ...dates }); // brouillon : non facturé
  await new ValidateInvoice(invoices).execute(finance, issued);
  await new RecordPayment(invoices, ids).execute(finance, { invoiceId: issued, amount: 1000, date: new Date() });
  return { clientId, getClient: new GetClient(clients, invoices, fixedClock("2026-01-15")) };
}

describe("Fiche client", () => {
  it("montre l'historique et les totaux, hors brouillons", async () => {
    const { clientId, getClient } = await setup();
    const client = await getClient.execute(finance, clientId);
    expect(client.invoices).toHaveLength(2);
    expect(client.totalBilled).toBe(3_000_000);
    expect(client.totalPaid).toBe(1_000_000);
  });

  it("une autre entreprise ne voit pas le client", async () => {
    const { clientId, getClient } = await setup();
    await expect(getClient.execute(otherCompany, clientId)).rejects.toThrow("Client introuvable.");
  });

  it("le collaborateur ne crée pas de client", async () => {
    const create = new CreateClient(new InMemoryClientRepository(), sequentialIds());
    await expect(create.execute(member, { name: "X Y", email: null, phone: null })).rejects.toThrow("droits");
  });
});
