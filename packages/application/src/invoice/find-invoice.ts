import type { Invoice } from "@cashpilot/domain";
import type { InvoiceRepository } from "../ports/invoice-repository";
import { NotFoundError } from "../shared/not-found-error";

/** Charge une facture de l'entreprise, ou lève une erreur si elle n'existe pas. */
export async function findInvoice(
  invoices: InvoiceRepository,
  companyId: string,
  invoiceId: string,
): Promise<Invoice> {
  const invoice = await invoices.byId(companyId, invoiceId);
  if (!invoice) throw new NotFoundError("Facture");
  return invoice;
}
