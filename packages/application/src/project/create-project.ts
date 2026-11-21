import { Project } from "@cashpilot/domain";
import type { ClientRepository } from "../ports/client-repository";
import type { IdGenerator } from "../ports/id-generator";
import type { ProjectRepository } from "../ports/project-repository";
import { assertCan, type Actor } from "../shared/actor";
import { NotFoundError } from "../shared/not-found-error";

export type CreateProjectInput = { name: string; clientId: string };

export class CreateProject {
  constructor(
    private readonly projects: ProjectRepository,
    private readonly clients: ClientRepository,
    private readonly ids: IdGenerator,
  ) {}

  async execute(actor: Actor, input: CreateProjectInput): Promise<{ id: string }> {
    assertCan(actor, "invoices:manage");
    const client = await this.clients.byId(actor.companyId, input.clientId);
    if (client?.kind !== "CLIENT") throw new NotFoundError("Client");

    const project = Project.create({ id: this.ids.next(), companyId: actor.companyId, ...input });
    await this.projects.save(project);
    return { id: project.id };
  }
}
