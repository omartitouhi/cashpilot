import { DomainError } from "@cashpilot/domain";
import { NotFoundError } from "./not-found-error";

/**
 * Vrai si l'erreur est « attendue » (règle métier, élément introuvable).
 * Son message peut alors être montré à l'utilisateur.
 */
export function isBusinessError(error: unknown): error is DomainError | NotFoundError {
  return error instanceof DomainError || error instanceof NotFoundError;
}
