"use server";

import type { ReceiptFile } from "@cashpilot/application";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { useCases } from "@/container";
import { fromBusinessError, fromZodError, formValues, type ActionState } from "@/lib/action-state";
import { getCurrentUser } from "@/lib/current-user";
import { RejectExpenseSchema, SubmitExpenseSchema } from "./schemas";

function refresh(expenseId: string) {
  revalidatePath("/depenses");
  revalidatePath(`/depenses/${expenseId}`);
}

/** Le fichier envoyé, ou null si le champ est vide. */
async function readReceipt(formData: FormData): Promise<ReceiptFile | null> {
  const file = formData.get("receipt");
  if (!(file instanceof File) || file.size === 0) return null;
  return { fileName: file.name, contentType: file.type, bytes: new Uint8Array(await file.arrayBuffer()) };
}

export async function submitExpenseAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const values = formValues(formData);
  const parsed = SubmitExpenseSchema.safeParse(values);
  if (!parsed.success) return { ...fromZodError(parsed.error), values };

  let expenseId: string;
  try {
    const receipt = await readReceipt(formData);
    const result = await useCases.submitExpense.execute(await getCurrentUser(), { ...parsed.data, receipt });
    expenseId = result.id;
  } catch (error) {
    return { ...fromBusinessError(error), values };
  }
  revalidatePath("/depenses");
  redirect(`/depenses/${expenseId}`);
}

export async function approveExpenseAction(expenseId: string): Promise<ActionState> {
  try {
    await useCases.approveExpense.execute(await getCurrentUser(), expenseId);
  } catch (error) {
    return fromBusinessError(error);
  }
  refresh(expenseId);
  return {};
}

export async function rejectExpenseAction(expenseId: string, _: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = RejectExpenseSchema.safeParse(formValues(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  try {
    await useCases.rejectExpense.execute(await getCurrentUser(), expenseId, parsed.data.reason);
  } catch (error) {
    return fromBusinessError(error);
  }
  refresh(expenseId);
  return {};
}

export async function payExpenseAction(expenseId: string): Promise<ActionState> {
  try {
    // Le paiement est enregistré à la date du jour.
    await useCases.payExpense.execute(await getCurrentUser(), { expenseId, paidAt: new Date() });
  } catch (error) {
    return fromBusinessError(error);
  }
  refresh(expenseId);
  return {};
}
