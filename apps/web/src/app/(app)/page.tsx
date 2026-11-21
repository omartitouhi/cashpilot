import { can } from "@cashpilot/application";
import { Clock, Landmark, Plus, Receipt } from "lucide-react";
import { AlertList, type Alert } from "@/components/dashboard/alert-list";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useCases } from "@/container";
import { getCurrentUser } from "@/lib/current-user";
import { formatDate } from "@/lib/format-date";
import { formatMoney } from "@/lib/format-money";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  // Le collaborateur n'a pas accès aux chiffres : on l'oriente vers ses dépenses.
  if (!can(user.role, "treasury:view")) {
    return (
      <>
        <PageHeader title={`Bonjour ${user.name}`} />
        <EmptyState icon={Receipt} title="Vos dépenses" description="Soumettez une dépense et suivez sa validation." />
        <div className="mt-6 flex justify-center">
          <ButtonLink href="/depenses/nouvelle">
            <Plus className="size-4" /> Nouvelle dépense
          </ButtonLink>
        </div>
      </>
    );
  }

  const dashboard = await useCases.getDashboard.execute(user);
  const alerts: Alert[] = [
    ...dashboard.overdueInvoices.map((i) => ({
      href: `/factures/${i.id}`,
      title: `Facture ${i.number} en retard`,
      detail: `${formatMoney(i.remaining)} · échue le ${formatDate(i.dueDate)}`,
      tone: "danger" as const,
    })),
    ...dashboard.pendingExpenses.map((e) => ({
      href: `/depenses/${e.id}`,
      title: `Dépense à valider : ${e.label}`,
      detail: formatMoney(e.amount),
      tone: "warning" as const,
    })),
  ];

  return (
    <>
      <PageHeader title="Tableau de bord" description="Vue d'ensemble de votre trésorerie." />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Solde actuel" value={formatMoney(dashboard.balance)} icon={Landmark} />
        <StatCard label="Reste à encaisser" value={formatMoney(dashboard.toCollect)} icon={Clock} />
        <StatCard label="Dépenses à valider" value={String(dashboard.pendingExpenses.length)} icon={Receipt} />
      </section>

      <div className="mt-8">
        <Card title="Alertes">
          <AlertList alerts={alerts} />
        </Card>
      </div>
    </>
  );
}
