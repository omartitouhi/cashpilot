import { describe, expect, it } from "vitest";
import { Money } from "../shared/money";
import { Invoice } from "./invoice";

function draftInvoice(dinars = 3000): Invoice {
  return Invoice.createDraft({
    id: "inv-1",
    companyId: "co-1",
    clientId: "cl-1",
    projectId: null,
    number: "F-001",
    amount: Money.fromDinars(dinars),
    issueDate: new Date("2026-01-01"),
    dueDate: new Date("2026-01-31"),
  });
}

function issuedInvoice(dinars = 3000): Invoice {
  const invoice = draftInvoice(dinars);
  invoice.validate();
  return invoice;
}

function pay(invoice: Invoice, dinars: number): void {
  invoice.recordPayment({ id: "p", amount: Money.fromDinars(dinars), date: new Date() });
}

describe("Invoice", () => {
  it("un paiement partiel diminue le reste à payer", () => {
    const invoice = issuedInvoice(3000);
    pay(invoice, 1000);
    expect(invoice.remainingAmount().toDinars()).toBe(2000);
    expect(invoice.status).toBe("ISSUED");
  });

  it("passe à PAID quand le reste atteint zéro", () => {
    const invoice = issuedInvoice(3000);
    pay(invoice, 1000);
    pay(invoice, 2000);
    expect(invoice.status).toBe("PAID");
  });

  it("refuse un paiement au-delà du reste à payer", () => {
    const invoice = issuedInvoice(3000);
    pay(invoice, 2500);
    expect(() => pay(invoice, 600)).toThrow("Le paiement dépasse le reste à payer.");
  });

  it("refuse un paiement sur un brouillon", () => {
    expect(() => pay(draftInvoice(), 100)).toThrow("Cette facture ne peut pas recevoir de paiement.");
  });

  it("corrige un paiement par une opération inverse, sans l'effacer", () => {
    const invoice = issuedInvoice(3000);
    invoice.recordPayment({ id: "p1", amount: Money.fromDinars(3000), date: new Date() });
    expect(invoice.status).toBe("PAID");

    invoice.reversePayment("p1", { id: "r1", date: new Date(), reason: "Saisi sur la mauvaise facture" });

    expect(invoice.status).toBe("ISSUED");
    expect(invoice.remainingAmount().toDinars()).toBe(3000);
    expect(invoice.snapshot().payments).toHaveLength(2); // l'erreur et sa correction restent visibles
  });

  it("ne corrige pas deux fois le même paiement", () => {
    const invoice = issuedInvoice(3000);
    invoice.recordPayment({ id: "p1", amount: Money.fromDinars(100), date: new Date() });
    invoice.reversePayment("p1", { id: "r1", date: new Date(), reason: "Erreur" });
    expect(() => invoice.reversePayment("p1", { id: "r2", date: new Date(), reason: "Erreur" })).toThrow(
      "Ce paiement a déjà été annulé.",
    );
  });

  it("refuse d'annuler une facture qui a des paiements", () => {
    const invoice = issuedInvoice(3000);
    pay(invoice, 100);
    expect(() => invoice.cancel()).toThrow("Une facture payée ne peut pas être annulée.");
  });

  it("est en retard après l'échéance si elle n'est pas soldée", () => {
    const invoice = issuedInvoice(3000);
    expect(invoice.isOverdue(new Date("2026-02-01"))).toBe(true);
    expect(invoice.isOverdue(new Date("2026-01-15"))).toBe(false);
  });

  it("n'est pas en retard le jour même de l'échéance", () => {
    const invoice = issuedInvoice(3000);
    expect(invoice.isOverdue(new Date("2026-01-31T18:00:00Z"))).toBe(false);
  });
});
