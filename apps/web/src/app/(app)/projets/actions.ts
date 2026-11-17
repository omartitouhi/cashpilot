"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { useCases } from "@/container";
import { fromBusinessError, fromZodError, formValues, type ActionState } from "@/lib/action-state";
import { getCurrentUser } from "@/lib/current-user";

const CreateProjectSchema = z.object({
  name: z.string().min(2, "Le nom est trop court."),
  clientId: z.string().min(1, "Choisissez un client."),
});

export async function createProjectAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const values = formValues(formData);
  const parsed = CreateProjectSchema.safeParse(values);
  if (!parsed.success) return { ...fromZodError(parsed.error), values };

  try {
    await useCases.createProject.execute(await getCurrentUser(), parsed.data);
  } catch (error) {
    return { ...fromBusinessError(error), values };
  }
  revalidatePath("/projets");
  return { success: "Projet créé." };
}
