"use client";

import { useActionState } from "react";
import { rejectExpenseAction } from "@/app/(app)/depenses/actions";
import { Field, inputClass } from "@/components/ui/field";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/ui/submit-button";

export function RejectForm({ expenseId }: { expenseId: string }) {
  const [state, formAction] = useActionState(rejectExpenseAction.bind(null, expenseId), {});

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <FormMessage message={state.message} />
      <Field label="Motif du refus" name="reason" errors={state.fieldErrors?.reason}>
        <textarea id="reason" name="reason" rows={2} required minLength={3} className={inputClass} />
      </Field>
      <SubmitButton variant="secondary">Refuser la dépense</SubmitButton>
    </form>
  );
}
