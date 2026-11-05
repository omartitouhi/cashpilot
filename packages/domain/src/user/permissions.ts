/**
 * Les trois rôles du sujet :
 * - OWNER   : dirigeant, il a tous les droits
 * - FINANCE : gestionnaire financier, il gère factures et paiements
 * - MEMBER  : collaborateur, il soumet des dépenses (module à venir)
 */
export type Role = "OWNER" | "FINANCE" | "MEMBER";

export type Permission = "invoices:view" | "invoices:manage" | "members:manage";

const PERMISSIONS: Record<Role, Permission[]> = {
  OWNER: ["invoices:view", "invoices:manage", "members:manage"],
  FINANCE: ["invoices:view", "invoices:manage"],
  MEMBER: [],
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
