import { can } from "@cashpilot/application";
import { Users } from "lucide-react";
import { AddClientForm } from "@/components/clients/add-client-form";
import { ClientTable } from "@/components/clients/client-table";
import { AccessDenied } from "@/components/ui/access-denied";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { useCases } from "@/container";
import { getCurrentUser } from "@/lib/current-user";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const user = await getCurrentUser();
  if (!can(user.role, "invoices:view")) return <AccessDenied />;

  const clients = await useCases.listClients.execute(user);

  return (
    <>
      <PageHeader title="Clients" description="Coordonnées et historique de facturation." />
      <div className="grid gap-6 xl:grid-cols-[1fr_22rem] xl:items-start">
        {clients.length === 0 ? (
          <EmptyState icon={Users} title="Aucun client" description="Ajoutez un client pour lui adresser des factures." />
        ) : (
          <ClientTable clients={clients} />
        )}
        {can(user.role, "invoices:manage") && (
          <Card title="Ajouter un client">
            <AddClientForm />
          </Card>
        )}
      </div>
    </>
  );
}
