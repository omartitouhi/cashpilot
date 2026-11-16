import { Banknote, CircleCheck, Clock, Download } from "lucide-react";
import { notFound } from "next/navigation";
import { can, NotFoundError, type SessionUser } from "@cashpilot/application";
import { InvoiceActions } from "@/components/invoices/invoice-actions";
import { AccessDenied } from "@/components/ui/access-denied";
import { InvoiceStatusBadge } from "@/components/invoices/invoice-status-badge";
import { PaymentList } from "@/components/invoices/payment-list";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useCases } from "@/container";
import { getCurrentUser } from "@/lib/current-user";
import { formatDate } from "@/lib/format-date";
import { formatMoney } from "@/lib/format-money";

export const dynamic = "force-dynamic";

async function loadInvoice(user: SessionUser, invoiceId: string) {
  try {
    return await useCases.getInvoice.execute(user, invoiceId);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }
}

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!can(user.role, "invoices:view")) return <AccessDenied />;

  const invoice = await loadInvoice(user, id);

  return (
    <>
      <PageHeader
        title={`Facture ${invoice.number}`}
        description={`Émise le ${formatDate(invoice.issueDate)} · échéance le ${formatDate(invoice.dueDate)}`}
        action={
          <div className="flex items-center gap-3">
            <InvoiceStatusBadge invoice={invoice} />
            <a
              href={`/factures/${invoice.id}/pdf`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-slate-50"
            >
              <Download className="size-4" /> PDF
            </a>
          </div>
        }
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Montant" value={formatMoney(invoice.amount)} icon={Banknote} />
        <StatCard label="Encaissé" value={formatMoney(invoice.paid)} icon={CircleCheck} />
        <StatCard label="Reste à payer" value={formatMoney(invoice.remaining)} icon={Clock} />
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Paiements reçus">
          <PaymentList
            payments={invoice.payments}
            invoiceId={can(user.role, "invoices:manage") ? invoice.id : undefined}
          />
        </Card>
        <Card title="Actions">
          <InvoiceActions invoice={invoice} />
        </Card>
      </div>
    </>
  );
}
