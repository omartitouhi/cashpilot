import type { Invoice } from "@cashpilot/domain";

/**
 * Ce dont les use cases ont besoin pour stocker les factures.
 * Chaque lecture est limitée à une entreprise : on ne voit jamais
 * les factures d'une autre entreprise.
 */
export interface InvoiceRepository {
  save(invoice: Invoice): Promise<void>;
  byId(companyId: string, id: string): Promise<Invoice | null>;
  allForCompany(companyId: string): Promise<Invoice[]>;
  countForCompany(companyId: string): Promise<number>;
}
