"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/action-state";
import { Field, inputClass } from "./field";
import { FormMessage } from "./form-message";
import { SubmitButton } from "./submit-button";

type Props = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  label: string; // ex. « Motif du refus »
  submitLabel: string;
};

/** Une action qui exige un motif écrit : refus, correction... */
export function ReasonForm({ action, label, submitLabel }: Props) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <FormMessage message={state.message} />
      <Field label={label} name="reason" errors={state.fieldErrors?.reason}>
        <textarea id="reason" name="reason" rows={2} required minLength={3} className={inputClass} />
      </Field>
      <SubmitButton variant="secondary">{submitLabel}</SubmitButton>
    </form>
  );
}
