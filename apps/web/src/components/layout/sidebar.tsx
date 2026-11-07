import { FileText, LayoutDashboard } from "lucide-react";
import { Logo } from "./logo";
import { NavLink } from "./nav-link";

const links = [
  { href: "/", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/factures", label: "Factures", icon: FileText },
];

export function Sidebar() {
  return (
    <aside className="flex shrink-0 flex-col border-b border-slate-200 bg-white px-4 py-4 md:w-60 md:border-r md:border-b-0 md:py-6">
      <div className="mb-4 px-3 md:mb-8">
        <Logo />
      </div>

      <nav className="flex gap-1 overflow-x-auto md:flex-col">
        {links.map(({ href, label, icon: Icon }) => (
          <NavLink key={href} href={href}>
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
