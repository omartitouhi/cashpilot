/** Catégories de dépenses adaptées à une agence digitale. */
export const EXPENSE_CATEGORIES = {
  SOFTWARE: "Logiciels et abonnements",
  FREELANCE: "Freelances et sous-traitance",
  ADVERTISING: "Publicité en ligne",
  EQUIPMENT: "Matériel",
  RENT: "Loyer et charges",
  SALARY: "Salaires",
  OTHER: "Autre",
} as const;

export type ExpenseCategory = keyof typeof EXPENSE_CATEGORIES;
