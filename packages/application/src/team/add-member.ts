import { assertValidPassword, User, type Role } from "@cashpilot/domain";
import { assertEmailAvailable } from "../auth/assert-email-available";
import type { IdGenerator } from "../ports/id-generator";
import type { PasswordHasher } from "../ports/password-hasher";
import type { UserRepository } from "../ports/user-repository";
import { assertCan, type Actor } from "../shared/actor";

export type AddMemberInput = {
  name: string;
  email: string;
  password: string; // mot de passe provisoire, transmis au membre
  role: Role;
};

/** Le dirigeant ajoute un membre à son entreprise. */
export class AddMember {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly ids: IdGenerator,
  ) {}

  async execute(actor: Actor, input: AddMemberInput): Promise<void> {
    assertCan(actor, "members:manage");
    assertValidPassword(input.password);
    await assertEmailAvailable(this.users, input.email);

    const member = User.create({
      id: this.ids.next(),
      companyId: actor.companyId, // toujours l'entreprise du dirigeant
      name: input.name,
      email: input.email,
      passwordHash: await this.hasher.hash(input.password),
      role: input.role,
    });
    await this.users.save(member);
  }
}
