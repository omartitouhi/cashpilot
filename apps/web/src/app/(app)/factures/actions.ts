"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { useCases } from "@/container";
import { fromBusinessError, fromZodError, formValues, type ActionState } from "@/lib/action-state";
import { getCurrentCompanyId } from "@/lib/current-company";
import { CreateInvoiceSchema } from "./schemas";

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
