import type { Project } from "@cashpilot/domain";

export interface ProjectRepository {
  save(project: Project): Promise<void>;
  byId(companyId: string, id: string): Promise<Project | null>;
  allForCompany(companyId: string): Promise<Project[]>;
}
