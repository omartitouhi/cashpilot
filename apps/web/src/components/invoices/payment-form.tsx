"use client";

import { useActionState } from "react";
import { recordPaymentAction } from "@/app/(app)/factures/actions";
import { Field, inputClass } from "@/components/ui/field";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/ui/submit-button";

type Props = {
  invoiceId: string;
  remainingDinars: number; // proposé par défaut
  today: string; // AAAA-MM-JJ
};

/** Formulaire d'encaissement : paiement total ou partiel. */
export function PaymentForm({ invoiceId, remainingDinars, today }: Props) {
  const [state, formAction] = useActionState(recordPaymentAction.bind(null, invoiceId), {});
  const values = state.values ?? {};
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormMessage message={state.message} />
      <Field label="Montant reçu (DT)" name="amount" errors={errors.amount}>
        <input id="amount" name="amount" type="number" min="0.001" step="0.001" required
          defaultValue={values.amount ?? remainingDinars} className={inputClass} />
      </Field>
      <Field label="Date de réception" name="date" errors={errors.date}>
        <input id="date" name="date" type="date" required
          defaultValue={values.date ?? today} className={inputClass} />
      </Field>
      <SubmitButton>Enregistrer le paiement</SubmitButton>
    </form>
  );
}
