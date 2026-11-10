import { isBusinessError } from "@cashpilot/application";
import { z } from "zod";

/** Ce qu'une Server Action renvoie au formulaire en cas de problème. */
export type ActionState = {
  message?: string; // erreur générale (règle métier)
  success?: string; // confirmation affichée après une réussite
  fieldErrors?: Record<string, string[] | undefined>; // erreurs par champ
  values?: Record<string, string>; // valeurs saisies, pour ne pas les perdre
};

/** Les valeurs texte d'un formulaire (les fichiers sont ignorés). */
export function formValues(formData: FormData): Record<string, string> {
  const entries = [...formData.entries()].filter(([, value]) => typeof value === "string");
  return Object.fromEntries(entries) as Record<string, string>;
}

/** Erreurs de validation Zod, champ par champ. */
export function fromZodError(error: z.ZodError): ActionState {
  return { fieldErrors: z.flattenError(error).fieldErrors };
}

/** Erreur métier → message affiché. Toute autre erreur est relancée. */
export function fromBusinessError(error: unknown): ActionState {
  if (isBusinessError(error)) return { message: error.message };
  throw error;
}
