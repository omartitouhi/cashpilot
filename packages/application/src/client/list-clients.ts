import type { ClientProps, PartnerKind } from "@cashpilot/domain";
import type { ClientRepository } from "../ports/client-repository";
import { assertCan, type Actor } from "../shared/actor";

export type ClientView = ClientProps;

/** Liste les clients ou les fournisseurs de l'entreprise, par ordre alphabétique. */
export class ListClients {
  constructor(private readonly clients: ClientRepository) {}

  async execute(actor: Actor, kind: PartnerKind = "CLIENT"): Promise<ClientView[]> {
    // Tout membre qui soumet une dépense peut choisir un fournisseur.
    assertCan(actor, kind === "CLIENT" ? "invoices:view" : "expenses:submit");
    const all = await this.clients.allForCompany(actor.companyId);
    return all
      .filter((client) => client.kind === kind)
      .map((client) => client.snapshot())
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
