/** Le même jour à minuit (UTC) : permet de comparer des dates sans les heures. */
export function startOfDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
