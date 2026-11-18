import { EXPENSE_CATEGORIES, NotFoundError, type SessionUser } from "@cashpilot/application";
import { notFound } from "next/navigation";
import { ExpenseActions } from "@/components/expenses/expense-actions";
import { ExpenseStatusBadge } from "@/components/expenses/expense-status-badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { useCases } from "@/container";
import { getCurrentUser } from "@/lib/current-user";
import { formatDate } from "@/lib/format-date";
import { formatMoney } from "@/lib/format-money";

export const dynamic = "force-dynamic";

async function loadExpense(user: SessionUser, expenseId: string) {
  try {
    return await useCases.getExpense.execute(user, expenseId);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }
}

/** Une ligne « libellé : valeur ». */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2 text-sm">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}

export default async function ExpensePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const [expense, suppliers] = await Promise.all([
    loadExpense(user, id),
    useCases.listClients.execute(user, "SUPPLIER"),
  ]);
  const supplier = suppliers.find((s) => s.id === expense.supplierId);

  return (
    <>
      <PageHeader
        title={expense.label}
        description={`Soumise par ${expense.submitterName}`}
        action={<ExpenseStatusBadge status={expense.status} />}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Détails">
          <dl className="divide-y divide-slate-100">
            <Row label="Montant">{formatMoney(expense.amount)}</Row>
            <Row label="Catégorie">{EXPENSE_CATEGORIES[expense.category]}</Row>
            <Row label="Fournisseur">{supplier?.name ?? "Aucun"}</Row>
            <Row label="Date de paiement prévue">{formatDate(expense.date)}</Row>
            <Row label="Justificatif">
              {expense.hasReceipt ? (
                <a href={`/depenses/${expense.id}/justificatif`} target="_blank" className="text-brand-700 hover:underline">
                  Ouvrir
                </a>
              ) : (
                "Aucun"
              )}
            </Row>
            {expense.decidedAt && (
              <Row label={expense.status === "REJECTED" ? "Refusée par" : "Approuvée par"}>
                {expense.decidedByName}, le {formatDate(expense.decidedAt)}
              </Row>
            )}
            {expense.rejectionReason && <Row label="Motif">{expense.rejectionReason}</Row>}
            {expense.reversal && (
              <Row label="Paiement annulé">
                {expense.reversal.paidAt && `payé le ${formatDate(expense.reversal.paidAt)}, `}
                annulé par {expense.reversal.byName} le {formatDate(expense.reversal.at)} : {expense.reversal.reason}
              </Row>
            )}
            {expense.paidAt && (
              <Row label="Payée par">
                {expense.paidByName}, le {formatDate(expense.paidAt)}
              </Row>
            )}
          </dl>
        </Card>
        <Card title="Actions">
          <ExpenseActions expense={expense} user={user} />
        </Card>
      </div>
    </>
  );
}
