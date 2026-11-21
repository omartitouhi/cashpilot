import type { ProjectRepository } from "../ports/project-repository";
import { assertCan, type Actor } from "../shared/actor";

/** Les noms des projets, pour les listes déroulantes (sans les montants). */
export class ListProjectNames {
  constructor(private readonly projects: ProjectRepository) {}

  async execute(actor: Actor): Promise<{ id: string; name: string; clientId: string }[]> {
    assertCan(actor, "expenses:submit");
    const projects = await this.projects.allForCompany(actor.companyId);
    return projects
      .map((p) => p.snapshot())
      .map(({ id, name, clientId }) => ({ id, name, clientId }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
