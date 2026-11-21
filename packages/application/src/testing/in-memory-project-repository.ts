import type { Project } from "@cashpilot/domain";
import type { ProjectRepository } from "../ports/project-repository";

/** Repository de projets en mémoire, pour les tests. */
export class InMemoryProjectRepository implements ProjectRepository {
  private readonly items = new Map<string, Project>();

  async save(project: Project): Promise<void> {
    this.items.set(project.id, project);
  }

  async byId(companyId: string, id: string): Promise<Project | null> {
    const project = this.items.get(id);
    return project?.snapshot().companyId === companyId ? project : null;
  }

  async allForCompany(companyId: string): Promise<Project[]> {
    return [...this.items.values()].filter((p) => p.snapshot().companyId === companyId);
  }
}
