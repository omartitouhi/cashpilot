"use client";

import { useActionState } from "react";
import { createProjectAction } from "@/app/(app)/projets/actions";
import { Field, inputClass } from "@/components/ui/field";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/ui/submit-button";

export function AddProjectForm({ clients }: { clients: { id: string; name: string }[] }) {
  const [state, formAction] = useActionState(createProjectAction, {});
  const values = state.values ?? {};
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormMessage message={state.message} success={state.success} />
      <Field label="Nom du projet" name="name" errors={errors.name}>
        <input id="name" name="name" required placeholder="Ex. : refonte du site" defaultValue={values.name}
          className={inputClass} />
      </Field>
      <Field label="Client" name="clientId" errors={errors.clientId}>
        <select key={values.clientId} id="clientId" name="clientId" required defaultValue={values.clientId ?? ""}
          className={inputClass}>
          <option value="" disabled>Choisir un client</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </Field>
      <SubmitButton>Créer le projet</SubmitButton>
    </form>
  );
}
