import { can, type ExpenseView, type SessionUser } from "@cashpilot/application";
import {
  approveExpenseAction,
  payExpenseAction,
  rejectExpenseAction,
  reverseExpensePaymentAction,
} from "@/app/(app)/depenses/actions";
import { ActionButton } from "@/components/ui/action-button";
import { ReasonForm } from "@/components/ui/reason-form";

type Props = { expense: ExpenseView; user: SessionUser };

/** Les actions possibles selon le statut de la dépense et le rôle de l'utilisateur. */
export function ExpenseActions({ expense, user }: Props) {
  if (expense.status === "SUBMITTED" && can(user.role, "expenses:approve")) {
    return (
      <div className="flex flex-col gap-4">
        <ActionButton action={approveExpenseAction.bind(null, expense.id)}>Approuver la dépense</ActionButton>
        <ReasonForm action={rejectExpenseAction.bind(null, expense.id)} label="Motif du refus" submitLabel="Refuser la dépense" />
      </div>
    );
  }
  if (expense.status === "APPROVED" && can(user.role, "expenses:pay")) {
    return <ActionButton action={payExpenseAction.bind(null, expense.id)}>Marquer comme payée</ActionButton>;
  }
  // Une seule correction possible : on ne la propose plus si elle a déjà eu lieu.
  if (expense.status === "PAID" && !expense.reversal && can(user.role, "expenses:pay")) {
    return (
      <ReasonForm
        action={reverseExpensePaymentAction.bind(null, expense.id)}
        label="Paiement enregistré par erreur ? Motif de la correction"
        submitLabel="Annuler ce paiement"
      />
    );
  }

  const messages = {
    SUBMITTED: "En attente de la décision du dirigeant.",
    APPROVED: "Approuvée, en attente de paiement par le gestionnaire financier.",
    REJECTED: "Cette dépense a été refusée.",
    PAID: "Cette dépense est payée.",
  };
  return <p className="text-sm text-slate-500">{messages[expense.status]}</p>;
}
