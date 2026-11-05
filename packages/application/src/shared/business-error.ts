import { DomainError } from "@cashpilot/domain";
import { ForbiddenError } from "./forbidden-error";
import { NotFoundError } from "./not-found-error";

type BusinessError = DomainError | NotFoundError | ForbiddenError;

/**
 * Vrai si l'erreur est « attendue » (règle métier, élément introuvable, droit manquant).
 * Son message peut alors être montré à l'utilisateur.
 */
export function isBusinessError(error: unknown): error is BusinessError {
  return error instanceof DomainError || error instanceof NotFoundError || error instanceof ForbiddenError;
}
