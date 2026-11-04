type Props = { title: string; children: React.ReactNode };

/** Bloc blanc avec un titre, pour regrouper du contenu. */
export function Card({ title, children }: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-sm font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}
