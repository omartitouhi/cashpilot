import Link from "next/link";

export type Alert = { href: string; title: string; detail: string; tone: "danger" | "warning" };

const dots = { danger: "bg-red-500", warning: "bg-amber-500" };

/** Liste d'alertes cliquables, ou un message si tout va bien. */
export function AlertList({ alerts }: { alerts: Alert[] }) {
  if (alerts.length === 0) {
    return <p className="text-sm text-slate-500">Aucune alerte : tout est à jour.</p>;
  }

  return (
    <ul className="divide-y divide-slate-100">
      {alerts.map((alert) => (
        <li key={`${alert.href}${alert.detail}`}>
          <Link href={alert.href} className="flex items-center gap-3 py-3 text-sm hover:text-brand-700">
            <span className={`size-2 shrink-0 rounded-full ${dots[alert.tone]}`} />
            <span className="font-medium">{alert.title}</span>
            <span className="ml-auto text-slate-500">{alert.detail}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
