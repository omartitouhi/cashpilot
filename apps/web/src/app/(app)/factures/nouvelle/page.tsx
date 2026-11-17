import { can } from "@cashpilot/application";
import { InvoiceForm } from "@/components/invoices/invoice-form";
import { AccessDenied } from "@/components/ui/access-denied";
import { PageHeader } from "@/components/ui/page-header";
import { useCases } from "@/container";
import { getCurrentUser } from "@/lib/current-user";
import { toInputDate } from "@/lib/format-date";

export const dynamic = "force-dynamic";

export default async function NewInvoicePage() {
  const user = await getCurrentUser();
  if (!can(user.role, "invoices:manage")) return <AccessDenied />;

  const [clients, projects] = await Promise.all([
    useCases.listClients.execute(user),
    useCases.listProjectNames.execute(user),
  ]);
  const clientNames = new Map(clients.map((c) => [c.id, c.name]));
  const today = new Date();
  const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  return (
    <>
      <PageHeader
        title="Nouvelle facture"
        description="La facture est créée en brouillon. Vous pourrez la valider ensuite."
      />
      <InvoiceForm
        clients={clients.map(({ id, name }) => ({ id, name }))}
        projects={projects.map((p) => ({ id: p.id, name: `${p.name} (${clientNames.get(p.clientId)})` }))}
        defaultIssueDate={toInputDate(today)}
        defaultDueDate={toInputDate(in30Days)}
      />
    </>
  );
}
