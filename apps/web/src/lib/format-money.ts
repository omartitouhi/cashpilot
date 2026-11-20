const formatter = new Intl.NumberFormat("fr-TN", {
  style: "currency",
  currency: "TND",
  minimumFractionDigits: 3,
});

/** Affiche des millimes en dinars : 1250500 → « 1 250,500 DT ». */
export function formatMoney(millimes: number): string {
  return formatter.format(millimes / 1000);
}
