import type { LucideIcon } from "lucide-react";

type Props = { label: string; value: string; icon: LucideIcon };

/** Carte d'indicateur : un libellé, une valeur, une icône. */
export function StatCard({ label, value, icon: Icon }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <Icon className="size-4 text-slate-400" />
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
