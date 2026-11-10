import { can, type ExpenseView, type SessionUser } from "@cashpilot/application";
import { approveExpenseAction, payExpenseAction } from "@/app/(app)/depenses/actions";
import { ActionButton } from "@/components/ui/action-button";
import { RejectForm } from "./reject-form";

type Props = { expense: ExpenseView; user: SessionUser };

/** Les actions possibles selon le statut de la dépense et le rôle de l'utilisateur. */
export function ExpenseActions({ expense, user }: Props) {
  if (expense.status === "SUBMITTED" && can(user.role, "expenses:approve")) {
    return (
      <div className="flex flex-col gap-4">
        <ActionButton action={approveExpenseAction.bind(null, expense.id)}>Approuver la dépense</ActionButton>
        <RejectForm expenseId={expense.id} />
      </div>
    );
  }
  if (expense.status === "APPROVED" && can(user.role, "expenses:pay")) {
    return <ActionButton action={payExpenseAction.bind(null, expense.id)}>Marquer comme payée</ActionButton>;
  }

  const messages = {
    SUBMITTED: "En attente de la décision du dirigeant.",
    APPROVED: "Approuvée, en attente de paiement par le gestionnaire financier.",
    REJECTED: "Cette dépense a été refusée.",
    PAID: "Cette dépense est payée.",
  };
  return <p className="text-sm text-slate-500">{messages[expense.status]}</p>;
}
