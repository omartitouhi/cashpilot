import type { Actor } from "../shared/actor";

/** Utilisateurs types de l'entreprise « co-1 », pour les tests. */
export const owner: Actor = { userId: "u-owner", companyId: "co-1", role: "OWNER" };
export const finance: Actor = { userId: "u-finance", companyId: "co-1", role: "FINANCE" };
export const member: Actor = { userId: "u-member", companyId: "co-1", role: "MEMBER" };

/** Un gestionnaire financier d'une AUTRE entreprise. */
export const otherCompany: Actor = { userId: "u-other", companyId: "co-2", role: "FINANCE" };
