import { DomainError } from "../shared/domain-error";

/** Règle de mot de passe : au moins 8 caractères. */
export function assertValidPassword(password: string): void {
  if (password.length < 8) {
    throw new DomainError("MOT_DE_PASSE_TROP_COURT", "Le mot de passe doit faire au moins 8 caractères.");
  }
}
