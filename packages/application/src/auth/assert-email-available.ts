import { DomainError } from "@cashpilot/domain";
import type { UserRepository } from "../ports/user-repository";

/** Une adresse email ne peut servir qu'à un seul compte. */
export async function assertEmailAvailable(users: UserRepository, email: string): Promise<void> {
  if (await users.byEmail(email.trim().toLowerCase())) {
    throw new DomainError("EMAIL_DEJA_UTILISE", "Cette adresse email est déjà utilisée.");
  }
}
