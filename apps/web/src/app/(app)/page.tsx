import { Clock, FileText, Landmark, Receipt } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { formatMoney } from "@/lib/format-money";

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Tableau de bord" description="Vue d'ensemble de votre trésorerie." />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Solde actuel" value={formatMoney(0)} icon={Landmark} />
        <StatCard label="Reste à encaisser" value={formatMoney(0)} icon={Clock} />
        <StatCard label="Dépenses à valider" value="0" icon={Receipt} />
      </section>

      <section className="mt-8">
        <EmptyState
          icon={FileText}
          title="Aucune facture pour l'instant"
          description="Créez votre première facture pour suivre vos encaissements et vos prévisions."
        />
      </section>
    </>
  );
}
