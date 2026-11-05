import { Banknote, CircleCheck, Clock } from "lucide-react";
import { notFound } from "next/navigation";
import { NotFoundError } from "@cashpilot/application";
import { InvoiceActions } from "@/components/invoices/invoice-actions";
import { InvoiceStatusBadge } from "@/components/invoices/invoice-status-badge";
import { PaymentList } from "@/components/invoices/payment-list";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useCases } from "@/container";
import { getCurrentCompanyId } from "@/lib/current-company";
import { formatDate } from "@/lib/format-date";
import { formatMoney } from "@/lib/format-money";

export const dynamic = "force-dynamic";

async function loadInvoice(invoiceId: string) {
  const companyId = await getCurrentCompanyId();
  try {
    return await useCases.getInvoice.execute({ companyId, invoiceId });
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }
}

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await loadInvoice(id);

  return (
    <>
      <PageHeader
        title={`Facture ${invoice.number}`}
        description={`Émise le ${formatDate(invoice.issueDate)} · échéance le ${formatDate(invoice.dueDate)}`}
        action={<InvoiceStatusBadge invoice={invoice} />}
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Montant" value={formatMoney(invoice.amount)} icon={Banknote} />
        <StatCard label="Encaissé" value={formatMoney(invoice.paid)} icon={CircleCheck} />
        <StatCard label="Reste à payer" value={formatMoney(invoice.remaining)} icon={Clock} />
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Paiements reçus">
          <PaymentList payments={invoice.payments} />
        </Card>
        <Card title="Actions">
          <InvoiceActions invoice={invoice} />
        </Card>
      </div>
    </>
  );
}
