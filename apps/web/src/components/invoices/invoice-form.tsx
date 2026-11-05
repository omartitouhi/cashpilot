"use client";

import { useActionState } from "react";
import { createInvoiceAction } from "@/app/(app)/factures/actions";
import { Field, inputClass } from "@/components/ui/field";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/ui/submit-button";

type Props = {
  clients: { id: string; name: string }[];
  defaultIssueDate: string; // AAAA-MM-JJ
  defaultDueDate: string;
};

export function InvoiceForm({ clients, defaultIssueDate, defaultDueDate }: Props) {
  const [state, formAction] = useActionState(createInvoiceAction, {});
  const values = state.values ?? {};
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5 rounded-xl border border-slate-200 bg-white p-6">
      <FormMessage message={state.message} />

      <Field label="Client" name="clientId" errors={errors.clientId}>
        {/* La key recrée le <select> avec le client saisi après un envoi refusé. */}
        <select key={values.clientId} id="clientId" name="clientId" required
          defaultValue={values.clientId ?? ""} className={inputClass}>
          <option value="" disabled>
            Choisir un client
          </option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Montant (DT)" name="amount" errors={errors.amount}>
        <input id="amount" name="amount" type="number" min="0.001" step="0.001" required
          defaultValue={values.amount} className={inputClass} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Date d'émission" name="issueDate" errors={errors.issueDate}>
          <input id="issueDate" name="issueDate" type="date" required
            defaultValue={values.issueDate ?? defaultIssueDate} className={inputClass} />
        </Field>
        <Field label="Échéance" name="dueDate" errors={errors.dueDate}>
          <input id="dueDate" name="dueDate" type="date" required
            defaultValue={values.dueDate ?? defaultDueDate} className={inputClass} />
        </Field>
      </div>

      <div className="flex justify-end">
        <SubmitButton>Créer la facture</SubmitButton>
      </div>
    </form>
  );
}
