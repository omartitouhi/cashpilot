import { can, NotFoundError, type SessionUser } from "@cashpilot/application";
import { Banknote, CircleCheck, Clock, FileText } from "lucide-react";
import { notFound } from "next/navigation";
import { InvoiceTable } from "@/components/invoices/invoice-table";
import { AccessDenied } from "@/components/ui/access-denied";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useCases } from "@/container";
import { getCurrentUser } from "@/lib/current-user";
import { formatMoney } from "@/lib/format-money";

export const dynamic = "force-dynamic";

async function loadClient(user: SessionUser, clientId: string) {
  try {
    return await useCases.getClient.execute(user, clientId);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }
}

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!can(user.role, "invoices:view")) return <AccessDenied />;

  const client = await loadClient(user, id);
  const contact = [client.email, client.phone].filter(Boolean).join(" · ") || "Aucune coordonnée";

  return (
    <>
      <PageHeader title={client.name} description={contact} />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Facturé" value={formatMoney(client.totalBilled)} icon={Banknote} />
        <StatCard label="Encaissé" value={formatMoney(client.totalPaid)} icon={CircleCheck} />
        <StatCard label="Reste à encaisser" value={formatMoney(client.totalBilled - client.totalPaid)} icon={Clock} />
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-sm font-semibold">Historique des factures</h2>
        {client.invoices.length === 0 ? (
          <EmptyState icon={FileText} title="Aucune facture" description="Ce client n'a pas encore été facturé." />
        ) : (
          <InvoiceTable invoices={client.invoices} clientNames={new Map([[client.id, client.name]])} />
        )}
      </section>
    </>
  );
}
