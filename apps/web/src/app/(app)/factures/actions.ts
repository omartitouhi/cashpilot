"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { useCases } from "@/container";
import { fromBusinessError, fromZodError, formValues, type ActionState } from "@/lib/action-state";
import { getCurrentUser } from "@/lib/current-user";
import { CreateInvoiceSchema, RecordPaymentSchema } from "./schemas";

/** Rafraîchit la liste et la page de la facture après une modification. */
function refresh(invoiceId: string) {
  revalidatePath("/factures");
  revalidatePath(`/factures/${invoiceId}`);
}

export async function createInvoiceAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const values = formValues(formData);
  const parsed = CreateInvoiceSchema.safeParse(values);
  if (!parsed.success) return { ...fromZodError(parsed.error), values };

  let invoiceId: string;
  try {
    const user = await getCurrentUser();
    const result = await useCases.createInvoice.execute(user, parsed.data);
    invoiceId = result.id;
  } catch (error) {
    return { ...fromBusinessError(error), values };
  }

  revalidatePath("/factures");
  redirect(`/factures/${invoiceId}`);
}

export async function validateInvoiceAction(invoiceId: string): Promise<ActionState> {
  try {
    await useCases.validateInvoice.execute(await getCurrentUser(), invoiceId);
  } catch (error) {
    return fromBusinessError(error);
  }
  refresh(invoiceId);
  return {};
}

export async function cancelInvoiceAction(invoiceId: string): Promise<ActionState> {
  try {
    await useCases.cancelInvoice.execute(await getCurrentUser(), invoiceId);
  } catch (error) {
    return fromBusinessError(error);
  }
  refresh(invoiceId);
  return {};
}

export async function recordPaymentAction(
  invoiceId: string,
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const values = formValues(formData);
  const parsed = RecordPaymentSchema.safeParse(values);
  if (!parsed.success) return { ...fromZodError(parsed.error), values };

  try {
    const user = await getCurrentUser();
    await useCases.recordPayment.execute(user, { invoiceId, ...parsed.data });
  } catch (error) {
    return { ...fromBusinessError(error), values };
  }
  refresh(invoiceId);
  return {};
}
