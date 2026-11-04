import { InvoiceForm } from "@/components/invoices/invoice-form";
import { PageHeader } from "@/components/ui/page-header";
import { useCases } from "@/container";
import { getCurrentCompanyId } from "@/lib/current-company";
import { toInputDate } from "@/lib/format-date";

export const dynamic = "force-dynamic";

export default async function NewInvoicePage() {
  const companyId = await getCurrentCompanyId();
  const clients = await useCases.listClients.execute(companyId);

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
        defaultIssueDate={toInputDate(today)}
        defaultDueDate={toInputDate(in30Days)}
      />
    </>
  );
}
