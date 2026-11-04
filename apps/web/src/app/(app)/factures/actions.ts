"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { useCases } from "@/container";
import { fromBusinessError, fromZodError, formValues, type ActionState } from "@/lib/action-state";
import { getCurrentCompanyId } from "@/lib/current-company";
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
    const companyId = await getCurrentCompanyId();
    const result = await useCases.createInvoice.execute({ companyId, ...parsed.data });
    invoiceId = result.id;
  } catch (error) {
    return { ...fromBusinessError(error), values };
  }

  revalidatePath("/factures");
  redirect(`/factures/${invoiceId}`);
}

export async function validateInvoiceAction(invoiceId: string): Promise<ActionState> {
  try {
    const companyId = await getCurrentCompanyId();
    await useCases.validateInvoice.execute({ companyId, invoiceId });
  } catch (error) {
    return fromBusinessError(error);
  }
  refresh(invoiceId);
  return {};
}

export async function cancelInvoiceAction(invoiceId: string): Promise<ActionState> {
  try {
    const companyId = await getCurrentCompanyId();
    await useCases.cancelInvoice.execute({ companyId, invoiceId });
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
    const companyId = await getCurrentCompanyId();
    await useCases.recordPayment.execute({ companyId, invoiceId, ...parsed.data });
  } catch (error) {
    return { ...fromBusinessError(error), values };
  }
  refresh(invoiceId);
  return {};
}
