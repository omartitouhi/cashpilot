"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { useCases } from "@/container";
import { fromBusinessError, fromZodError, formValues, type ActionState } from "@/lib/action-state";
import { getCurrentUser } from "@/lib/current-user";

const emptyToNull = (v: unknown) => (v === "" ? null : v);

const CreateClientSchema = z.object({
  kind: z.enum(["CLIENT", "SUPPLIER"]),
  name: z.string().min(2, "Le nom est trop court."),
  email: z.preprocess(emptyToNull, z.email("Adresse email invalide.").nullable()),
  phone: z.preprocess(emptyToNull, z.string().max(30, "Numéro trop long.").nullable()),
});

/** Crée un client ou un fournisseur selon le champ caché « kind ». */
export async function createClientAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const values = formValues(formData);
  const parsed = CreateClientSchema.safeParse(values);
  if (!parsed.success) return { ...fromZodError(parsed.error), values };

  try {
    await useCases.createClient.execute(await getCurrentUser(), parsed.data);
  } catch (error) {
    return { ...fromBusinessError(error), values };
  }
  revalidatePath(parsed.data.kind === "CLIENT" ? "/clients" : "/fournisseurs");
  return { success: parsed.data.kind === "CLIENT" ? "Client ajouté." : "Fournisseur ajouté." };
}
