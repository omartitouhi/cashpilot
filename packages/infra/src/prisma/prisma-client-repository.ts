import type { ClientRepository } from "@cashpilot/application";
import { prisma, type Client as ClientRow } from "@cashpilot/db";
import { Client } from "@cashpilot/domain";

function toDomain(row: ClientRow): Client {
  return Client.restore({ id: row.id, companyId: row.companyId, name: row.name, email: row.email, phone: row.phone });
}

export class PrismaClientRepository implements ClientRepository {
  async save(client: Client): Promise<void> {
    const data = client.snapshot();
    await prisma.client.upsert({ where: { id: data.id }, create: data, update: data });
  }

  async byId(companyId: string, id: string): Promise<Client | null> {
    const row = await prisma.client.findFirst({ where: { id, companyId } });
    return row ? toDomain(row) : null;
  }

  async allForCompany(companyId: string): Promise<Client[]> {
    const rows = await prisma.client.findMany({ where: { companyId } });
    return rows.map(toDomain);
  }
}
