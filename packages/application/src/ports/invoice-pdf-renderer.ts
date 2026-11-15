import type { InvoiceView } from "../invoice/invoice-view";

/** Tout ce qu'il faut pour imprimer une facture. */
export type InvoiceDocument = {
  companyName: string;
  client: { name: string; email: string | null; phone: string | null };
  invoice: InvoiceView;
};

/** Transforme une facture en fichier PDF. */
export interface InvoicePdfRenderer {
  render(document: InvoiceDocument): Promise<Uint8Array<ArrayBuffer>>;
}
