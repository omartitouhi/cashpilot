"use client";

import type { PartnerKind } from "@cashpilot/application";
import { useActionState } from "react";
import { createClientAction } from "@/app/(app)/clients/actions";
import { Field, inputClass } from "@/components/ui/field";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/ui/submit-button";

export function AddClientForm({ kind }: { kind: PartnerKind }) {
  const [state, formAction] = useActionState(createClientAction, {});
  const values = state.values ?? {};
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="kind" value={kind} />
      <FormMessage message={state.message} success={state.success} />
      <Field label="Nom" name="name" errors={errors.name}>
        <input id="name" name="name" required defaultValue={values.name} className={inputClass} />
      </Field>
      <Field label="Email (facultatif)" name="email" errors={errors.email}>
        <input id="email" name="email" type="email" defaultValue={values.email} className={inputClass} />
      </Field>
      <Field label="Téléphone (facultatif)" name="phone" errors={errors.phone}>
        <input id="phone" name="phone" type="tel" defaultValue={values.phone} className={inputClass} />
      </Field>
      <SubmitButton>{kind === "CLIENT" ? "Ajouter le client" : "Ajouter le fournisseur"}</SubmitButton>
    </form>
  );
}
