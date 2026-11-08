import { can } from "@cashpilot/application";
import { FileText, Plus } from "lucide-react";
import { InvoiceTable } from "@/components/invoices/invoice-table";
import { AccessDenied } from "@/components/ui/access-denied";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { useCases } from "@/container";
import { getCurrentUser } from "@/lib/current-user";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const user = await getCurrentUser();
  if (!can(user.role, "invoices:view")) return <AccessDenied />;

  const [invoices, clients] = await Promise.all([
    useCases.listInvoices.execute(user),
    useCases.listClients.execute(user),
  ]);
  const clientNames = new Map(clients.map((c) => [c.id, c.name]));

  return (
    <>
      <PageHeader
        title="Factures"
        description="Suivez vos factures et ce qu'il reste à encaisser."
        action={
          <ButtonLink href="/factures/nouvelle">
            <Plus className="size-4" /> Nouvelle facture
          </ButtonLink>
        }
      />

      {invoices.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Aucune facture pour l'instant"
          description="Créez votre première facture pour suivre vos encaissements."
        />
      ) : (
        <InvoiceTable invoices={invoices} clientNames={clientNames} />
      )}
    </>
  );
}
