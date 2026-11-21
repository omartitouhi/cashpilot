import { can, type Permission, type SessionUser } from "@cashpilot/application";
import { FileText, LayoutDashboard, Receipt, Users, type LucideIcon } from "lucide-react";
import { Logo } from "./logo";
import { NavLink } from "./nav-link";
import { UserMenu } from "./user-menu";

type Link = { href: string; label: string; icon: LucideIcon; permission?: Permission };

const links: Link[] = [
  { href: "/", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/factures", label: "Factures", icon: FileText, permission: "invoices:view" },
  { href: "/depenses", label: "Dépenses", icon: Receipt, permission: "expenses:submit" },
  { href: "/equipe", label: "Équipe", icon: Users, permission: "members:manage" },
];

export function Sidebar({ user }: { user: SessionUser }) {
  // On n'affiche que les liens autorisés pour le rôle de l'utilisateur.
  const visibleLinks = links.filter((link) => !link.permission || can(user.role, link.permission));

  return (
    <aside className="flex shrink-0 flex-col border-b border-slate-200 bg-white px-4 py-4 md:w-60 md:border-r md:border-b-0 md:py-6">
      <div className="mb-4 px-3 md:mb-8">
        <Logo />
      </div>

      <nav className="flex gap-1 overflow-x-auto md:flex-col">
        {visibleLinks.map(({ href, label, icon: Icon }) => (
          <NavLink key={href} href={href}>
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 border-t border-slate-100 pt-4 md:mt-auto">
        <UserMenu user={user} />
      </div>
    </aside>
  );
}
