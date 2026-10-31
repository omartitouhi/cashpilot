/**
 * Cycle de vie d'une facture :
 * DRAFT (brouillon) → ISSUED (validée) → PAID (soldée)
 * DRAFT ou ISSUED sans paiement → CANCELLED (annulée)
 */
export type InvoiceStatus = "DRAFT" | "ISSUED" | "PAID" | "CANCELLED";
