import { Lock } from "lucide-react";

/** Affiché quand le rôle de l'utilisateur ne permet pas d'ouvrir la page. */
export function AccessDenied() {
  return (
    <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Lock className="size-5" />
      </span>
      <h1 className="mt-4 font-medium">Accès refusé</h1>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Votre rôle ne permet pas d'ouvrir cette page. Contactez le dirigeant de votre entreprise.
      </p>
    </div>
  );
}
