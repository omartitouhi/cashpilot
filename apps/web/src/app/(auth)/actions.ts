"use server";

import { redirect } from "next/navigation";
import { useCases } from "@/container";
import { fromBusinessError, fromZodError, formValues, type ActionState } from "@/lib/action-state";
import { createSession, deleteSession } from "@/lib/session";
import { LoginSchema, RegisterSchema } from "./schemas";

export async function loginAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const values = formValues(formData);
  const parsed = LoginSchema.safeParse(values);
  if (!parsed.success) return { ...fromZodError(parsed.error), values };

  try {
    const user = await useCases.login.execute(parsed.data);
    await createSession(user);
  } catch (error) {
    return { ...fromBusinessError(error), values: { email: values.email ?? "" } };
  }
  redirect("/");
}

export async function registerAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const values = formValues(formData);
  const parsed = RegisterSchema.safeParse(values);
  if (!parsed.success) return { ...fromZodError(parsed.error), values };

  try {
    const owner = await useCases.registerCompany.execute(parsed.data);
    await createSession(owner);
  } catch (error) {
    return { ...fromBusinessError(error), values };
  }
  redirect("/");
}

export async function logoutAction(): Promise<void> {
  await deleteSession();
  redirect("/connexion");
}
