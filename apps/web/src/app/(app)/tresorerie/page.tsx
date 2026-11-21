import { can } from "@cashpilot/application";
import { ArrowDownLeft, ArrowUpRight, Landmark, PiggyBank } from "lucide-react";
import { MovementTable } from "@/components/treasury/movement-table";
import { AccessDenied } from "@/components/ui/access-denied";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useCases } from "@/container";
import { getCurrentUser } from "@/lib/current-user";
import { formatMoney } from "@/lib/format-money";

export const dynamic = "force-dynamic";

export default async function TreasuryPage() {
  const user = await getCurrentUser();
  if (!can(user.role, "treasury:view")) return <AccessDenied />;

  const treasury = await useCases.getTreasury.execute(user);

  return (
    <>
      <PageHeader title="Trésorerie" description="Solde réel : solde initial + encaissements - dépenses payées." />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Solde initial" value={formatMoney(treasury.initialBalance)} icon={PiggyBank} />
        <StatCard label="Encaissements" value={formatMoney(treasury.totalIn)} icon={ArrowDownLeft} />
        <StatCard label="Décaissements" value={formatMoney(treasury.totalOut)} icon={ArrowUpRight} />
        <StatCard label="Solde actuel" value={formatMoney(treasury.balance)} icon={Landmark} />
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-sm font-semibold">Historique des opérations</h2>
        {treasury.movements.length === 0 ? (
          <EmptyState
            icon={Landmark}
            title="Aucune opération réalisée"
            description="Les paiements reçus et les dépenses payées apparaîtront ici."
          />
        ) : (
          <MovementTable movements={treasury.movements} />
        )}
      </section>
    </>
  );
}
