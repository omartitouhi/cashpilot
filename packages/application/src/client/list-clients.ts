import type { ClientProps } from "@cashpilot/domain";
import type { ClientRepository } from "../ports/client-repository";
import { assertCan, type Actor } from "../shared/actor";

export type ClientView = ClientProps;

/** Liste les clients de l'entreprise, par ordre alphabétique. */
export class ListClients {
  constructor(private readonly clients: ClientRepository) {}

  async execute(actor: Actor): Promise<ClientView[]> {
    assertCan(actor, "invoices:view");
    const clients = await this.clients.allForCompany(actor.companyId);
    return clients
      .map((client) => client.snapshot())
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
