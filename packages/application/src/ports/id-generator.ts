/** Fabrique des identifiants uniques. */
export interface IdGenerator {
  next(): string;
}
