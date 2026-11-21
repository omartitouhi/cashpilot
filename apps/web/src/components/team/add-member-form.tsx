"use client";

import { useActionState } from "react";
import { addMemberAction } from "@/app/(app)/equipe/actions";
import { Field, inputClass } from "@/components/ui/field";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/ui/submit-button";

export function AddMemberForm() {
  const [state, formAction] = useActionState(addMemberAction, {});
  const values = state.values ?? {};
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormMessage message={state.message} success={state.success} />
      <Field label="Nom complet" name="name" errors={errors.name}>
        <input id="name" name="name" required defaultValue={values.name} className={inputClass} />
      </Field>
      <Field label="Email" name="email" errors={errors.email}>
        <input id="email" name="email" type="email" required defaultValue={values.email} className={inputClass} />
      </Field>
      <Field label="Rôle" name="role" errors={errors.role}>
        {/* La key recrée le <select> avec le rôle saisi après un envoi refusé. */}
        <select key={values.role} id="role" name="role" required defaultValue={values.role ?? "MEMBER"}
          className={inputClass}>
          <option value="MEMBER">Collaborateur</option>
          <option value="FINANCE">Gestionnaire financier</option>
          <option value="OWNER">Dirigeant</option>
        </select>
      </Field>
      <Field label="Mot de passe provisoire" name="password" errors={errors.password}>
        <input id="password" name="password" type="password" required minLength={8}
          autoComplete="new-password" className={inputClass} />
      </Field>
      <SubmitButton>Ajouter le membre</SubmitButton>
    </form>
  );
}
