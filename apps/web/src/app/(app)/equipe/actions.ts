"use server";

import { revalidatePath } from "next/cache";
import { useCases } from "@/container";
import { fromBusinessError, fromZodError, formValues, type ActionState } from "@/lib/action-state";
import { getCurrentUser } from "@/lib/current-user";
import { AddMemberSchema } from "./schemas";

export async function addMemberAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const values = formValues(formData);
  const parsed = AddMemberSchema.safeParse(values);
  if (!parsed.success) return { ...fromZodError(parsed.error), values };

  try {
    await useCases.addMember.execute(await getCurrentUser(), parsed.data);
  } catch (error) {
    return { ...fromBusinessError(error), values };
  }
  revalidatePath("/equipe");
  return { success: "Membre ajouté. Transmettez-lui son mot de passe provisoire." };
}
