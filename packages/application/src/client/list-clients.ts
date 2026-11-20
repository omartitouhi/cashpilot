import type { ClientProps } from "@cashpilot/domain";
import type { ClientRepository } from "../ports/client-repository";

export type ClientView = ClientProps;

/** Liste les clients d'une entreprise, par ordre alphabétique. */
export class ListClients {
  constructor(private readonly clients: ClientRepository) {}

  async execute(companyId: string): Promise<ClientView[]> {
    const clients = await this.clients.allForCompany(companyId);
    return clients
      .map((client) => client.snapshot())
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
