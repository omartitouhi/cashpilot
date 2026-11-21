import type { User } from "@cashpilot/domain";
import type { Actor } from "../shared/actor";

/** Ce qu'on garde en session après connexion : l'Actor et le nom affiché. */
export type SessionUser = Actor & { name: string };

export function toSessionUser(user: User): SessionUser {
  const { id, companyId, role, name } = user.snapshot();
  return { userId: id, companyId, role, name };
}
