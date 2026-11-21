import type { User } from "@cashpilot/domain";
import type { UserRepository } from "../ports/user-repository";

/** Repository d'utilisateurs en mémoire, pour les tests. */
export class InMemoryUserRepository implements UserRepository {
  private readonly items = new Map<string, User>();

  async save(user: User): Promise<void> {
    this.items.set(user.id, user);
  }

  async byEmail(email: string): Promise<User | null> {
    const users = [...this.items.values()];
    return users.find((u) => u.snapshot().email === email.toLowerCase()) ?? null;
  }

  async allForCompany(companyId: string): Promise<User[]> {
    return [...this.items.values()].filter((u) => u.snapshot().companyId === companyId);
  }
}
