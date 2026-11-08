import { SearchX } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";

/** Affiché quand un élément n'existe pas ou n'appartient pas à l'entreprise. */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <SearchX className="size-5" />
      </span>
      <h1 className="mt-4 font-medium">Page introuvable</h1>
      <p className="mt-1 mb-6 text-sm text-slate-500">Cet élément n'existe pas ou n'est plus disponible.</p>
      <ButtonLink href="/">Retour au tableau de bord</ButtonLink>
    </div>
  );
}
