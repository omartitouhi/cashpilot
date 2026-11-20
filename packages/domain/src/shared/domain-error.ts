/**
 * Erreur métier : elle porte un code stable.
 * La présentation choisit ensuite le message affiché à l'utilisateur.
 */
export class DomainError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "DomainError";
  }
}
