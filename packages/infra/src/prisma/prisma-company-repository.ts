import type { CompanyRepository } from "@cashpilot/application";
import { prisma } from "@cashpilot/db";
import { Company, Money } from "@cashpilot/domain";

export class PrismaCompanyRepository implements CompanyRepository {
  async save(company: Company): Promise<void> {
    const { id, name, initialBalance } = company.snapshot();
    const data = { id, name, initialBalance: initialBalance.toDinars() };
    await prisma.company.upsert({ where: { id }, create: data, update: data });
  }

  async byId(id: string): Promise<Company | null> {
    const row = await prisma.company.findUnique({ where: { id } });
    if (!row) return null;
    return Company.restore({
      id: row.id,
      name: row.name,
      initialBalance: Money.fromDinars(row.initialBalance.toNumber()),
    });
  }
}
