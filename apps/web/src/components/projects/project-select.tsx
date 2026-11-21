import { Field, inputClass } from "@/components/ui/field";

type Props = { projects: { id: string; name: string }[]; defaultValue?: string; errors?: string[] };

/** Liste déroulante facultative pour rattacher une facture ou une dépense à un projet. */
export function ProjectSelect({ projects, defaultValue, errors }: Props) {
  return (
    <Field label="Projet (facultatif)" name="projectId" errors={errors}>
      {/* La key recrée le <select> avec la valeur saisie après un envoi refusé. */}
      <select key={defaultValue} id="projectId" name="projectId" defaultValue={defaultValue ?? ""} className={inputClass}>
        <option value="">Aucun</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    </Field>
  );
}
