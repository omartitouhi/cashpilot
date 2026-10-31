import { DomainError } from "./domain-error";

/**
 * Un montant en dinars tunisiens (DT).
 * Il est stocké en millimes entiers (1 DT = 1000 millimes) :
 * les additions restent exactes, sans erreur d'arrondi.
 */
export class Money {
  private constructor(readonly millimes: number) {}

  static fromMillimes(millimes: number): Money {
    if (!Number.isSafeInteger(millimes)) {
      throw new DomainError("MONTANT_INVALIDE", "Le montant est invalide.");
    }
    return new Money(millimes);
  }

  static fromDinars(dinars: number): Money {
    return Money.fromMillimes(Math.round(dinars * 1000));
  }

  static zero(): Money {
    return new Money(0);
  }

  add(other: Money): Money {
    return new Money(this.millimes + other.millimes);
  }

  subtract(other: Money): Money {
    return new Money(this.millimes - other.millimes);
  }

  isZero(): boolean {
    return this.millimes === 0;
  }

  isPositive(): boolean {
    return this.millimes > 0;
  }

  isNegative(): boolean {
    return this.millimes < 0;
  }

  isGreaterThan(other: Money): boolean {
    return this.millimes > other.millimes;
  }

  toDinars(): number {
    return this.millimes / 1000;
  }
}
