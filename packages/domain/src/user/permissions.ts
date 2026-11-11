/**
 * Les trois rôles du sujet :
 * - OWNER   : dirigeant, il a tous les droits et approuve les dépenses
 * - FINANCE : gestionnaire financier, il gère factures, paiements et paie les dépenses
 * - MEMBER  : collaborateur, il soumet des dépenses et suit ses demandes
 */
export type Role = "OWNER" | "FINANCE" | "MEMBER";

export type Permission =
  | "invoices:view"
  | "invoices:manage"
  | "members:manage"
  | "expenses:submit"
  | "expenses:view-all" // sinon, on ne voit que ses propres dépenses
  | "expenses:approve"
  | "expenses:pay"
  | "treasury:view";

const PERMISSIONS: Record<Role, Permission[]> = {
  OWNER: [
    "invoices:view",
    "invoices:manage",
    "members:manage",
    "expenses:submit",
    "expenses:view-all",
    "expenses:approve",
    "expenses:pay",
    "treasury:view",
  ],
  FINANCE: [
    "invoices:view",
    "invoices:manage",
    "expenses:submit",
    "expenses:view-all",
    "expenses:pay",
    "treasury:view",
  ],
  MEMBER: ["expenses:submit"],
};

/** Vrai si ce rôle a cette permission. */
export function can(role: Role, permission: Permission): boolean {
  return PERMISSIONS[role].includes(permission);
}

export const ROLE_LABELS: Record<Role, string> = {
  OWNER: "Dirigeant",
  FINANCE: "Gestionnaire financier",
  MEMBER: "Collaborateur",
};
