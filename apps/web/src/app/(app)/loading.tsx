/** Affiché automatiquement pendant le chargement d'une page. */
export default function Loading() {
  return (
    <div className="animate-pulse" aria-label="Chargement">
      <div className="mb-8 h-7 w-48 rounded bg-slate-200" />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="h-24 rounded-xl bg-slate-200" />
        <div className="h-24 rounded-xl bg-slate-200" />
        <div className="h-24 rounded-xl bg-slate-200" />
      </div>
      <div className="mt-6 h-48 rounded-xl bg-slate-200" />
    </div>
  );
}
