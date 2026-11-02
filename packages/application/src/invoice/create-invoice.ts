import { Invoice, Money } from "@cashpilot/domain";
import type { ClientRepository } from "../ports/client-repository";
import type { IdGenerator } from "../ports/id-generator";
import type { InvoiceRepository } from "../ports/invoice-repository";
import { NotFoundError } from "../shared/not-found-error";

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
    private readonly clients: ClientRepository,
    private readonly ids: IdGenerator,
  ) {}

  async execute(input: CreateInvoiceInput): Promise<{ id: string }> {
    // Le client doit appartenir à la même entreprise.
    const client = await this.clients.byId(input.companyId, input.clientId);
    if (!client) throw new NotFoundError("Client");

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
