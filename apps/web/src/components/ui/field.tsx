type Props = {
  label: string;
  name: string;
  errors?: string[];
  children: React.ReactNode; // le champ : <input>, <select>...
};

/** Un champ de formulaire : libellé, contrôle et message d'erreur. */
export function Field({ label, name, errors, children }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {errors?.[0] && <p className="text-sm text-red-600">{errors[0]}</p>}
    </div>
  );
}

/** Style commun des <input> et <select>. */
export const inputClass =
  "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none";
