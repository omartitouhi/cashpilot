import type { LucideIcon } from "lucide-react";

type Props = { icon: LucideIcon; title: string; description: string };

/** Affiché quand une liste ne contient encore aucun élément. */
export function EmptyState({ icon: Icon, title, description }: Props) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Icon className="size-5" />
      </span>
      <h2 className="mt-4 font-medium">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
    </div>
  );
}
