/** L'utilisateur n'a pas le droit de faire cette action. */
export class ForbiddenError extends Error {
  readonly code = "INTERDIT";

  constructor() {
    super("Vous n'avez pas les droits pour cette action.");
    this.name = "ForbiddenError";
  }
}
