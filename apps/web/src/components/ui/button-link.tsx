import Link from "next/link";

type Props = { href: string; children: React.ReactNode };

/** Lien qui ressemble à un bouton principal. */
export function ButtonLink({ href, children }: Props) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
    >
      {children}
    </Link>
  );
}
