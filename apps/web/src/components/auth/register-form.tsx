"use client";

import { useActionState } from "react";
import { registerAction } from "@/app/(auth)/actions";
import { Field, inputClass } from "@/components/ui/field";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/ui/submit-button";

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, {});
  const values = state.values ?? {};
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <FormMessage message={state.message} />

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-3 text-sm font-semibold text-slate-900">Votre entreprise</legend>
        <Field label="Nom de l'entreprise" name="companyName" errors={errors.companyName}>
          <input id="companyName" name="companyName" required defaultValue={values.companyName}
            className={inputClass} />
        </Field>
        <Field label="Solde bancaire actuel (DT)" name="initialBalance" errors={errors.initialBalance}>
          <input id="initialBalance" name="initialBalance" type="number" step="0.001" required
            defaultValue={values.initialBalance} className={inputClass} />
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-3 text-sm font-semibold text-slate-900">Votre compte dirigeant</legend>
        <Field label="Nom complet" name="ownerName" errors={errors.ownerName}>
          <input id="ownerName" name="ownerName" required autoComplete="name"
            defaultValue={values.ownerName} className={inputClass} />
        </Field>
        <Field label="Email" name="email" errors={errors.email}>
          <input id="email" name="email" type="email" required autoComplete="email"
            defaultValue={values.email} className={inputClass} />
        </Field>
        <Field label="Mot de passe (8 caractères minimum)" name="password" errors={errors.password}>
          <input id="password" name="password" type="password" required minLength={8}
            autoComplete="new-password" className={inputClass} />
        </Field>
      </fieldset>

      <SubmitButton>Créer mon entreprise</SubmitButton>
    </form>
  );
}
