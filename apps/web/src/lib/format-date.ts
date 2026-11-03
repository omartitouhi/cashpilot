const formatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeZone: "UTC" });

/** Affiche une date : « 21 nov. 2026 ». */
export function formatDate(date: Date): string {
  return formatter.format(date);
}
