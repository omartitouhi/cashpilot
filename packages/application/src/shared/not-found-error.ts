/** L'élément demandé n'existe pas (ou n'appartient pas à l'entreprise). */
export class NotFoundError extends Error {
  readonly code = "INTROUVABLE";

  constructor(what: string) {
    super(`${what} introuvable.`);
    this.name = "NotFoundError";
  }
}
