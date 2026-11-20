const formatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeZone: "UTC" });

/** Affiche une date : « 21 nov. 2026 ». */
export function formatDate(date: Date): string {
  return formatter.format(date);
}

/** Format attendu par <input type="date"> : « 2026-11-21 ». */
export function toInputDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
