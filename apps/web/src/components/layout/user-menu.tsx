import { ROLE_LABELS, type SessionUser } from "@cashpilot/application";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/(auth)/actions";

/** Nom et rôle de l'utilisateur connecté, avec le bouton de déconnexion. */
export function UserMenu({ user }: { user: SessionUser }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg px-3 py-2">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{user.name}</p>
        <p className="truncate text-xs text-slate-500">{ROLE_LABELS[user.role]}</p>
      </div>
      <form action={logoutAction}>
        <button
          type="submit"
          aria-label="Se déconnecter"
          title="Se déconnecter"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          <LogOut className="size-4" />
        </button>
      </form>
    </div>
  );
}
