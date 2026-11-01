import { Invoice, Money } from "@cashpilot/domain";
import type { IdGenerator } from "../ports/id-generator";
import type { InvoiceRepository } from "../ports/invoice-repository";

export type CreateInvoiceInput = {
  companyId: string;
  clientId: string;
  amount: number; // en dinars
  issueDate: Date;
  dueDate: Date;
};

/** Crée une facture en brouillon avec un numéro automatique (F-0001, F-0002...). */
export class CreateInvoice {
  constructor(
    private readonly invoices: InvoiceRepository,
    private readonly ids: IdGenerator,
  ) {}

  async execute(input: CreateInvoiceInput): Promise<{ id: string }> {
    const count = await this.invoices.countForCompany(input.companyId);
    const invoice = Invoice.createDraft({
      id: this.ids.next(),
      companyId: input.companyId,
      clientId: input.clientId,
      number: `F-${String(count + 1).padStart(4, "0")}`,
      amount: Money.fromDinars(input.amount),
      issueDate: input.issueDate,
      dueDate: input.dueDate,
    });
    await this.invoices.save(invoice);
    return { id: invoice.id };
  }
}
