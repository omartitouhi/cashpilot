import { can, type Permission, type Role } from "@cashpilot/domain";
import { ForbiddenError } from "./forbidden-error";

/** L'utilisateur connecté qui demande une action. */
export type Actor = {
  userId: string;
  companyId: string;
  role: Role;
};

/** Bloque l'action si le rôle de l'utilisateur n'a pas la permission. */
export function assertCan(actor: Actor, permission: Permission): void {
  if (!can(actor.role, permission)) throw new ForbiddenError();
}
