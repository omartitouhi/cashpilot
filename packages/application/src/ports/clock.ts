/** Donne l'heure actuelle. Injecté pour pouvoir figer le temps dans les tests. */
export interface Clock {
  now(): Date;
}
