import { Money } from "../shared/money";

/** Une opération réalisée : encaissement (montant positif) ou décaissement (négatif). */
export type Movement = {
  id: string; // id du paiement ou de la dépense : chaque opération n'apparaît qu'une fois
  date: Date;
  label: string;
  amount: Money;
};

export type MovementWithBalance = Movement & { balanceAfter: Money };

/** Solde réel = solde initial + somme des opérations réalisées. */
export function computeBalance(initial: Money, movements: Movement[]): Money {
  return movements.reduce((balance, m) => balance.add(m.amount), initial);
}

/** Historique trié par date, avec le solde après chaque opération. */
export function withRunningBalance(initial: Money, movements: Movement[]): MovementWithBalance[] {
  const sorted = [...movements].sort((a, b) => a.date.getTime() - b.date.getTime());
  let balance = initial;
  return sorted.map((m) => {
    balance = balance.add(m.amount);
    return { ...m, balanceAfter: balance };
  });
}
