import type { UserRepository } from "@cashpilot/application";
import { prisma, type User as UserRow } from "@cashpilot/db";
import { User } from "@cashpilot/domain";

function toDomain(row: UserRow): User {
  return User.restore({
    id: row.id,
    companyId: row.companyId,
    name: row.name,
    email: row.email,
    passwordHash: row.passwordHash,
    role: row.role,
  });
}

export class PrismaUserRepository implements UserRepository {
  async save(user: User): Promise<void> {
    const data = user.snapshot();
    await prisma.user.upsert({ where: { id: data.id }, create: data, update: data });
  }

  async byEmail(email: string): Promise<User | null> {
    const row = await prisma.user.findUnique({ where: { email } });
    return row ? toDomain(row) : null;
  }

  async allForCompany(companyId: string): Promise<User[]> {
    const rows = await prisma.user.findMany({ where: { companyId } });
    return rows.map(toDomain);
  }
}
