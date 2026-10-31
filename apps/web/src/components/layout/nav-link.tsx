"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = { href: string; children: React.ReactNode };

/** Lien de menu, mis en avant quand la page est ouverte. */
export function NavLink({ href, children }: Props) {
  const isActive = usePathname() === href;
  const style = isActive
    ? "bg-brand-50 text-brand-700"
    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900";

  return (
    <Link href={href} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap ${style}`}>
      {children}
    </Link>
  );
}
