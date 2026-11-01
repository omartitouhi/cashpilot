import type { Clock } from "../ports/clock";
import type { IdGenerator } from "../ports/id-generator";

/** Horloge figée à une date choisie. */
export function fixedClock(isoDate: string): Clock {
  return { now: () => new Date(isoDate) };
}

/** Générateur d'identifiants prévisibles : id-1, id-2, ... */
export function sequentialIds(): IdGenerator {
  let count = 0;
  return { next: () => `id-${++count}` };
}
