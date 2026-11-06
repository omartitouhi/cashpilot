import type { PasswordHasher } from "@cashpilot/application";
import bcrypt from "bcryptjs";

/** Hachage bcrypt : lent exprès, pour résister aux attaques par force brute. */
export class BcryptPasswordHasher implements PasswordHasher {
  hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
