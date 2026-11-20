"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

type Props = { href: string; label: string; icon: LucideIcon };

/** Lien de menu, mis en avant quand la page est ouverte. */
export function NavLink({ href, label, icon: Icon }: Props) {
  const isActive = usePathname() === href;
  const style = isActive
    ? "bg-brand-50 text-brand-700"
    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900";

  return (
    <Link href={href} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${style}`}>
      <Icon className="size-4" />
      {label}
    </Link>
  );
}
