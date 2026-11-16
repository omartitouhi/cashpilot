import type { Money } from "../shared/money";

/**
 * Un encaissement reçu pour une facture.
 * Une contre-passation (correction) est un paiement négatif qui pointe vers le paiement corrigé.
 */
export type Payment = {
  id: string;
  amount: Money;
  date: Date;
  reversalOf?: string; // id du paiement annulé par cette opération
  reason?: string; // motif de la correction
};
