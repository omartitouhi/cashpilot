"use client";

import { useActionState } from "react";
import { reversePaymentAction } from "@/app/(app)/factures/actions";
import { inputClass } from "@/components/ui/field";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/ui/submit-button";

/** Petit formulaire repliable pour annuler un paiement erroné, avec motif. */
export function ReversePaymentForm({ invoiceId, paymentId }: { invoiceId: string; paymentId: string }) {
  const [state, formAction] = useActionState(reversePaymentAction.bind(null, invoiceId, paymentId), {});

  return (
    <details className="text-xs">
      <summary className="cursor-pointer text-slate-500 hover:text-slate-900">Corriger</summary>
      <form action={formAction} className="mt-2 flex flex-col gap-2">
        <FormMessage message={state.message} />
        <input name="reason" required minLength={3} aria-label="Motif de la correction"
          placeholder="Motif (ex. : saisi sur la mauvaise facture)" className={inputClass} />
        <SubmitButton variant="secondary">Annuler ce paiement</SubmitButton>
      </form>
    </details>
  );
}
