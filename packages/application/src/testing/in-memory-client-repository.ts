import type { Client } from "@cashpilot/domain";
import type { ClientRepository } from "../ports/client-repository";

/** Repository de clients en mémoire, pour les tests. */
export class InMemoryClientRepository implements ClientRepository {
  private readonly items = new Map<string, Client>();

  async save(client: Client): Promise<void> {
    this.items.set(client.id, client);
  }

  async byId(companyId: string, id: string): Promise<Client | null> {
    const client = this.items.get(id);
    return client?.snapshot().companyId === companyId ? client : null;
  }

  async allForCompany(companyId: string): Promise<Client[]> {
    return [...this.items.values()].filter((c) => c.snapshot().companyId === companyId);
  }
}
