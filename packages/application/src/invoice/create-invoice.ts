import { DomainError, Invoice, Money } from "@cashpilot/domain";
import type { ClientRepository } from "../ports/client-repository";
import type { IdGenerator } from "../ports/id-generator";
import type { InvoiceRepository } from "../ports/invoice-repository";
import type { ProjectRepository } from "../ports/project-repository";
import { findProject } from "../project/find-project";
import { assertCan, type Actor } from "../shared/actor";
import { NotFoundError } from "../shared/not-found-error";

export type CreateInvoiceInput = {
  clientId: string;
  projectId?: string | null;
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
    private readonly projects: ProjectRepository,
  ) {}

  async execute(actor: Actor, input: CreateInvoiceInput): Promise<{ id: string }> {
    assertCan(actor, "invoices:manage");
    const { companyId } = actor;

    // Le client doit appartenir à la même entreprise.
    const client = await this.clients.byId(companyId, input.clientId);
    if (client?.kind !== "CLIENT") throw new NotFoundError("Client"); // pas de facture à un fournisseur

    const projectId = input.projectId ?? null;
    if (projectId) {
      const project = await findProject(this.projects, companyId, projectId);
      if (project.snapshot().clientId !== input.clientId) {
        throw new DomainError("PROJET_AUTRE_CLIENT", "Ce projet appartient à un autre client.");
      }
    }

    const count = await this.invoices.countForCompany(companyId);
    const invoice = Invoice.createDraft({
      id: this.ids.next(),
      companyId,
      clientId: input.clientId,
      projectId,
      number: `F-${String(count + 1).padStart(4, "0")}`,
      amount: Money.fromDinars(input.amount),
      issueDate: input.issueDate,
      dueDate: input.dueDate,
    });
    await this.invoices.save(invoice);
    return { id: invoice.id };
  }
}
