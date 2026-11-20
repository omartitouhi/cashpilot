import type { Money } from "../shared/money";

/** Un encaissement reçu pour une facture. */
export type Payment = {
  id: string;
  amount: Money;
  date: Date;
};
