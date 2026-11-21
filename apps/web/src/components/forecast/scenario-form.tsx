import Link from "next/link";
import type { ScenarioParams } from "@/app/(app)/previsions/scenario";
import { Field, inputClass } from "@/components/ui/field";
import { toInputDate } from "@/lib/format-date";

type Props = {
  invoices: { id: string; label: string }[];
  params: Partial<ScenarioParams>;
};

const dateValue = (date?: Date) => (date ? toInputDate(date) : undefined);

/** Formulaire GET : les hypothèses vont dans l'URL, aucune donnée n'est modifiée. */
export function ScenarioForm({ invoices, params }: Props) {
  return (
    <form method="get" className="flex flex-col gap-6">
      <fieldset className="grid gap-3 sm:grid-cols-[1fr_8rem]">
        <legend className="mb-2 text-sm font-semibold">Retard de paiement d'un client</legend>
        <Field label="Facture" name="delayInvoice">
          <select id="delayInvoice" name="delayInvoice" defaultValue={params.delayInvoice ?? ""} className={inputClass}>
            <option value="">Aucune</option>
            {invoices.map((invoice) => (
              <option key={invoice.id} value={invoice.id}>{invoice.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Jours de retard" name="delayDays">
          <input id="delayDays" name="delayDays" type="number" min="1" defaultValue={params.delayDays} className={inputClass} />
        </Field>
      </fieldset>

      <FlowFields legend="Nouvelle dépense" prefix="expense" params={params} />
      <FlowFields legend="Rentrée prévue" prefix="income" params={params} />

      <div className="flex justify-end gap-3">
        <Link href="/previsions" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">
          Réinitialiser
        </Link>
        <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          Simuler
        </button>
      </div>
    </form>
  );
}

type FlowFieldsProps = { legend: string; prefix: "expense" | "income"; params: Partial<ScenarioParams> };

/** Libellé, montant et date d'un flux ajouté par hypothèse. */
function FlowFields({ legend, prefix, params }: FlowFieldsProps) {
  return (
    <fieldset className="grid gap-3 sm:grid-cols-3">
      <legend className="mb-2 text-sm font-semibold">{legend}</legend>
      <Field label="Libellé" name={`${prefix}Label`}>
        <input id={`${prefix}Label`} name={`${prefix}Label`} defaultValue={params[`${prefix}Label`]} className={inputClass} />
      </Field>
      <Field label="Montant (DT)" name={`${prefix}Amount`}>
        <input id={`${prefix}Amount`} name={`${prefix}Amount`} type="number" min="0.001" step="0.001"
          defaultValue={params[`${prefix}Amount`]} className={inputClass} />
      </Field>
      <Field label="Date" name={`${prefix}Date`}>
        <input id={`${prefix}Date`} name={`${prefix}Date`} type="date"
          defaultValue={dateValue(params[`${prefix}Date`])} className={inputClass} />
      </Field>
    </fieldset>
  );
}
