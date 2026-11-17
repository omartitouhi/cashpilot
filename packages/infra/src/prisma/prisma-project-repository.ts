import type { ProjectRepository } from "@cashpilot/application";
import { prisma, type Project as ProjectRow } from "@cashpilot/db";
import { Project } from "@cashpilot/domain";

function toDomain({ id, companyId, clientId, name }: ProjectRow): Project {
  return Project.restore({ id, companyId, clientId, name });
}

export class PrismaProjectRepository implements ProjectRepository {
  async save(project: Project): Promise<void> {
    const data = project.snapshot();
    await prisma.project.upsert({ where: { id: data.id }, create: data, update: data });
  }

  async byId(companyId: string, id: string): Promise<Project | null> {
    const row = await prisma.project.findFirst({ where: { id, companyId } });
    return row ? toDomain(row) : null;
  }

  async allForCompany(companyId: string): Promise<Project[]> {
    const rows = await prisma.project.findMany({ where: { companyId } });
    return rows.map(toDomain);
  }
}
