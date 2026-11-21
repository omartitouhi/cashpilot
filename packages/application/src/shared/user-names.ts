import type { UserRepository } from "../ports/user-repository";

/** Les noms des membres de l'entreprise, par identifiant. */
export async function userNames(users: UserRepository, companyId: string): Promise<Map<string, string>> {
  const members = await users.allForCompany(companyId);
  return new Map(members.map((user) => [user.id, user.snapshot().name]));
}
