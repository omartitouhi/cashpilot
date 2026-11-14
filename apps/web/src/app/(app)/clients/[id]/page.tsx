import { isBusinessError, NotFoundError, type SessionUser } from "@cashpilot/application";
import { Banknote, CircleCheck, Clock, FileText } from "lucide-react";
import { notFound } from "next/navigation";
import { ExpenseTable } from "@/components/expenses/expense-table";
import { InvoiceTable } from "@/components/invoices/invoice-table";
import { AccessDenied } from "@/components/ui/access-denied";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useCases } from "@/container";
import { getCurrentUser } from "@/lib/current-user";
import { formatMoney } from "@/lib/format-money";

export const dynamic = "force-dynamic";

async function loadPartner(user: SessionUser, id: string) {
  try {
    return await useCases.getClient.execute(user, id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    if (isBusinessError(error)) return null; // droits insuffisants
    throw error;
  }
}

/** Fiche d'un client (factures) ou d'un fournisseur (dépenses). Sert aussi /fournisseurs/[id]. */
export default async function PartnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const partner = await loadPartner(await getCurrentUser(), id);
  if (!partner) return <AccessDenied />;

  const isClient = partner.kind === "CLIENT";
  const contact = [partner.email, partner.phone].filter(Boolean).join(" · ") || "Aucune coordonnée";
  const remaining = partner.totalCommitted - partner.totalSettled;

  return (
    <>
      <PageHeader title={partner.name} description={contact} />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label={isClient ? "Facturé" : "Engagé"} value={formatMoney(partner.totalCommitted)} icon={Banknote} />
        <StatCard label={isClient ? "Encaissé" : "Payé"} value={formatMoney(partner.totalSettled)} icon={CircleCheck} />
        <StatCard label={isClient ? "Reste à encaisser" : "Reste à payer"} value={formatMoney(remaining)} icon={Clock} />
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-sm font-semibold">{isClient ? "Historique des factures" : "Historique des dépenses"}</h2>
        {isClient && partner.invoices.length > 0 && <InvoiceTable invoices={partner.invoices} />}
        {!isClient && partner.expenses.length > 0 && <ExpenseTable expenses={partner.expenses} />}
        {partner.invoices.length + partner.expenses.length === 0 && (
          <EmptyState icon={FileText} title="Aucun historique" description="Rien n'a encore été enregistré pour ce tiers." />
        )}
      </section>
    </>
  );
}
