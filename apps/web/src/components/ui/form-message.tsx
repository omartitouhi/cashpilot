type Props = { message?: string; success?: string };

/** Message en haut d'un formulaire : erreur (rouge) ou confirmation (vert). */
export function FormMessage({ message, success }: Props) {
  if (message) {
    return (
      <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
        {message}
      </p>
    );
  }
  if (success) {
    return (
      <p role="status" className="rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-700">
        {success}
      </p>
    );
  }
  return null;
}
