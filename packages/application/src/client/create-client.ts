import { Client } from "@cashpilot/domain";
import type { ClientRepository } from "../ports/client-repository";
import type { IdGenerator } from "../ports/id-generator";
import { assertCan, type Actor } from "../shared/actor";

export type CreateClientInput = { name: string; email: string | null; phone: string | null };

export class CreateClient {
  constructor(
    private readonly clients: ClientRepository,
    private readonly ids: IdGenerator,
  ) {}

  async execute(actor: Actor, input: CreateClientInput): Promise<{ id: string }> {
    assertCan(actor, "invoices:manage");
    const client = Client.create({ id: this.ids.next(), companyId: actor.companyId, ...input });
    await this.clients.save(client);
    return { id: client.id };
  }
}
