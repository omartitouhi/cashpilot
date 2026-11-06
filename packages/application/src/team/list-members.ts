import type { Role } from "@cashpilot/domain";
import type { UserRepository } from "../ports/user-repository";
import { assertCan, type Actor } from "../shared/actor";

/** Un membre affiché dans l'équipe (sans l'empreinte du mot de passe). */
export type MemberView = { id: string; name: string; email: string; role: Role };

export class ListMembers {
  constructor(private readonly users: UserRepository) {}

  async execute(actor: Actor): Promise<MemberView[]> {
    assertCan(actor, "members:manage");
    const users = await this.users.allForCompany(actor.companyId);
    return users
      .map((user) => user.snapshot())
      .map(({ id, name, email, role }) => ({ id, name, email, role }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
