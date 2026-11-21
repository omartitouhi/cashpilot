/** Transforme un mot de passe en empreinte, et vérifie une empreinte. */
export interface PasswordHasher {
  hash(password: string): Promise<string>;
  verify(password: string, hash: string): Promise<boolean>;
}
