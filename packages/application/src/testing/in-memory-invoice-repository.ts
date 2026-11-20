import type { Invoice } from "@cashpilot/domain";
import type { InvoiceRepository } from "../ports/invoice-repository";

/** Repository en mémoire : pour les tests, sans base de données. */
export class InMemoryInvoiceRepository implements InvoiceRepository {
  private readonly items = new Map<string, Invoice>();

  async save(invoice: Invoice): Promise<void> {
    this.items.set(invoice.id, invoice);
  }

  async byId(companyId: string, id: string): Promise<Invoice | null> {
    const invoice = this.items.get(id);
    return invoice?.snapshot().companyId === companyId ? invoice : null;
  }

  async allForCompany(companyId: string): Promise<Invoice[]> {
    return [...this.items.values()].filter((i) => i.snapshot().companyId === companyId);
  }

  async countForCompany(companyId: string): Promise<number> {
    return (await this.allForCompany(companyId)).length;
  }
}
