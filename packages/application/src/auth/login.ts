import { DomainError } from "@cashpilot/domain";
import type { PasswordHasher } from "../ports/password-hasher";
import type { UserRepository } from "../ports/user-repository";
import { toSessionUser, type SessionUser } from "./session-user";

export type LoginInput = { email: string; password: string };

/** Vérifie l'email et le mot de passe. */
export class Login {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
  ) {}

  async execute({ email, password }: LoginInput): Promise<SessionUser> {
    const user = await this.users.byEmail(email.trim().toLowerCase());
    const isValid = user !== null && (await this.hasher.verify(password, user.snapshot().passwordHash));

    // Même message dans les deux cas : on ne révèle pas si l'email existe.
    if (!user || !isValid) {
      throw new DomainError("IDENTIFIANTS_INVALIDES", "Email ou mot de passe incorrect.");
    }
    return toSessionUser(user);
  }
}
