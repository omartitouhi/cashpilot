import { Company, Money } from "@cashpilot/domain";
import { describe, expect, it } from "vitest";
import type { InvoiceDocument } from "../ports/invoice-pdf-renderer";
import { finance, member, otherCompany } from "../testing/actors";
import { clientsWithOne, fixedClock, sequentialIds } from "../testing/fakes";
import { InMemoryCompanyRepository } from "../testing/in-memory-company-repository";
import { InMemoryInvoiceRepository } from "../testing/in-memory-invoice-repository";
import { CreateInvoice } from "./create-invoice";
import { ExportInvoicePdf } from "./export-invoice-pdf";

async function setup() {
  const invoices = new InMemoryInvoiceRepository();
  const clients = await clientsWithOne("co-1", "cl-1");
  const companies = new InMemoryCompanyRepository();
  await companies.save(Company.create({ id: "co-1", name: "Agence Pixel", initialBalance: Money.zero() }));
  const { id } = await new CreateInvoice(invoices, clients, sequentialIds()).execute(finance, {
    clientId: "cl-1", amount: 3000, issueDate: new Date("2026-01-01"), dueDate: new Date("2026-01-31"),
  });

  const rendered: InvoiceDocument[] = [];
  const renderer = { render: async (doc: InvoiceDocument) => (rendered.push(doc), new Uint8Array([1])) };
  return { id, rendered, exportPdf: new ExportInvoicePdf(invoices, clients, companies, renderer, fixedClock("2026-01-10")) };
}

describe("ExportInvoicePdf", () => {
  it("transmet l'entreprise, le client et la facture au rendu", async () => {
    const { id, rendered, exportPdf } = await setup();
    const file = await exportPdf.execute(finance, id);

    expect(file.fileName).toBe("facture-F-0001.pdf");
    expect(rendered[0]?.companyName).toBe("Agence Pixel");
    expect(rendered[0]?.client.name).toBe("Client test");
    expect(rendered[0]?.invoice.amount).toBe(3_000_000);
  });

  it("refuse une autre entreprise et le collaborateur", async () => {
    const { id, exportPdf } = await setup();
    await expect(exportPdf.execute(otherCompany, id)).rejects.toThrow("Facture introuvable.");
    await expect(exportPdf.execute(member, id)).rejects.toThrow("droits");
  });
});
