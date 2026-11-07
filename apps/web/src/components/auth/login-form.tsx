"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/(auth)/actions";
import { Field, inputClass } from "@/components/ui/field";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/ui/submit-button";

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, {});
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <FormMessage message={state.message} />
      <Field label="Email" name="email" errors={errors.email}>
        <input id="email" name="email" type="email" required autoComplete="email"
          defaultValue={state.values?.email} className={inputClass} />
      </Field>
      <Field label="Mot de passe" name="password" errors={errors.password}>
        <input id="password" name="password" type="password" required autoComplete="current-password"
          className={inputClass} />
      </Field>
      <SubmitButton>Se connecter</SubmitButton>
    </form>
  );
}
