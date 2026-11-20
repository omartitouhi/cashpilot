import { LayoutDashboard, Wallet } from "lucide-react";
import { NavLink } from "./nav-link";

const links = [{ href: "/", label: "Tableau de bord", icon: LayoutDashboard }];

export function Sidebar() {
  return (
    <aside className="flex shrink-0 flex-col border-b border-slate-200 bg-white px-4 py-4 md:w-60 md:border-r md:border-b-0 md:py-6">
      <div className="mb-4 flex items-center gap-2 px-3 md:mb-8">
        <span className="flex size-8 items-center justify-center rounded-lg bg-brand-500 text-white">
          <Wallet className="size-4" />
        </span>
        <span className="text-lg font-semibold">CashPilot</span>
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
