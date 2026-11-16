import type { Project } from "@cashpilot/domain";
import type { ProjectRepository } from "../ports/project-repository";
import { NotFoundError } from "../shared/not-found-error";

/** Charge un projet de l'entreprise, ou lève une erreur. */
export async function findProject(projects: ProjectRepository, companyId: string, projectId: string): Promise<Project> {
  const project = await projects.byId(companyId, projectId);
  if (!project) throw new NotFoundError("Projet");
  return project;
}
