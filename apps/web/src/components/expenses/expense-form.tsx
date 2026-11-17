"use client";

import { EXPENSE_CATEGORIES, RECEIPT_TYPES } from "@cashpilot/application";
import { useActionState } from "react";
import { submitExpenseAction } from "@/app/(app)/depenses/actions";
import { ProjectSelect } from "@/components/projects/project-select";
import { Field, inputClass } from "@/components/ui/field";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/ui/submit-button";

type Option = { id: string; name: string };
type Props = { defaultDate: string; suppliers: Option[]; projects: Option[] };

export function ExpenseForm({ defaultDate, suppliers, projects }: Props) {
  const [state, formAction] = useActionState(submitExpenseAction, {});
  const values = state.values ?? {};
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5 rounded-xl border border-slate-200 bg-white p-6">
      <FormMessage message={state.message} />

      <Field label="Libellé" name="label" errors={errors.label}>
        <input id="label" name="label" required placeholder="Ex. : abonnement Figma"
          defaultValue={values.label} className={inputClass} />
      </Field>

      <Field label="Catégorie" name="category" errors={errors.category}>
        {/* La key recrée le <select> avec la valeur saisie après un envoi refusé. */}
        <select key={values.category} id="category" name="category" required
          defaultValue={values.category ?? ""} className={inputClass}>
          <option value="" disabled>Choisir une catégorie</option>
          {Object.entries(EXPENSE_CATEGORIES).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </Field>

      <Field label="Fournisseur (facultatif)" name="supplierId">
        <select key={values.supplierId} id="supplierId" name="supplierId"
          defaultValue={values.supplierId ?? ""} className={inputClass}>
          <option value="">Aucun</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </Field>

      <ProjectSelect projects={projects} defaultValue={values.projectId} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Montant (DT)" name="amount" errors={errors.amount}>
          <input id="amount" name="amount" type="number" min="0.001" step="0.001" required
            defaultValue={values.amount} className={inputClass} />
        </Field>
        <Field label="Date de paiement prévue" name="date" errors={errors.date}>
          <input id="date" name="date" type="date" required
            defaultValue={values.date ?? defaultDate} className={inputClass} />
        </Field>
      </div>

      <Field label="Justificatif (PDF ou image, 2 Mo max, facultatif)" name="receipt">
        <input id="receipt" name="receipt" type="file" accept={RECEIPT_TYPES.join(",")}
          className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-brand-700" />
      </Field>

      <div className="flex justify-end">
        <SubmitButton>Soumettre la dépense</SubmitButton>
      </div>
    </form>
  );
}
