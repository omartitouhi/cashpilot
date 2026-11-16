import { describe, expect, it } from "vitest";
import { Money } from "../shared/money";
import { Expense } from "./expense";

const now = new Date("2026-03-01");

function submitted(): Expense {
  return Expense.submit({
    id: "exp-1",
    companyId: "co-1",
    submittedBy: "u-member",
    label: "Licence Figma",
    category: "SOFTWARE",
    amount: Money.fromDinars(450),
    date: new Date("2026-03-10"),
    receiptId: null,
    supplierId: null,
    projectId: null,
  });
}

describe("Expense", () => {
  it("suit le parcours soumise → approuvée → payée", () => {
    const expense = submitted();
    expense.approve("u-owner", now);
    expense.markPaid("u-finance", now);
    expect(expense.status).toBe("PAID");
    expect(expense.snapshot().paidBy).toBe("u-finance");
  });

  it("une dépense refusée ne peut pas être payée", () => {
    const expense = submitted();
    expense.reject("u-owner", "Pas prévu au budget", now);
    expect(() => expense.markPaid("u-finance", now)).toThrow("Une dépense refusée ne peut pas être payée.");
  });

  it("une dépense ne peut pas être payée deux fois", () => {
    const expense = submitted();
    expense.approve("u-owner", now);
    expense.markPaid("u-finance", now);
    expect(() => expense.markPaid("u-finance", now)).toThrow("Cette dépense est déjà payée.");
  });

  it("refuse le paiement d'une dépense pas encore approuvée", () => {
    expect(() => submitted().markPaid("u-finance", now)).toThrow("doit d'abord être approuvée");
  });

  it("exige un motif de refus", () => {
    expect(() => submitted().reject("u-owner", "", now)).toThrow("Indiquez le motif du refus.");
  });

  it("n'accepte plus de justificatif une fois traitée", () => {
    const expense = submitted();
    expense.attachReceipt("r-1");
    expense.approve("u-owner", now);
    expect(() => expense.attachReceipt("r-2")).toThrow("Cette dépense a déjà été traitée.");
  });

  it("ne peut pas être approuvée deux fois", () => {
    const expense = submitted();
    expense.approve("u-owner", now);
    expect(() => expense.approve("u-owner", now)).toThrow("Cette dépense a déjà été traitée.");
  });
});
