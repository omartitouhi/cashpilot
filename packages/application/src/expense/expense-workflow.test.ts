import { InMemoryProjectRepository } from "../testing/in-memory-project-repository";
import { describe, expect, it } from "vitest";
import { finance, member, owner } from "../testing/actors";
import { fixedClock, sequentialIds } from "../testing/fakes";
import { InMemoryClientRepository } from "../testing/in-memory-client-repository";
import { InMemoryExpenseRepository } from "../testing/in-memory-expense-repository";
import { InMemoryReceiptStorage } from "../testing/in-memory-receipt-storage";
import { InMemoryUserRepository } from "../testing/in-memory-user-repository";
import { ApproveExpense } from "./approve-expense";
import { GetReceipt } from "./get-receipt";
import { ListExpenses } from "./list-expenses";
import { PayExpense } from "./pay-expense";
import { RejectExpense } from "./reject-expense";
import { ReverseExpensePayment } from "./reverse-expense-payment";
import { SubmitExpense } from "./submit-expense";

const pdf = { fileName: "facture.pdf", contentType: "application/pdf", bytes: new Uint8Array([1, 2, 3]) };
const input = { label: "Licence Figma", category: "SOFTWARE" as const, amount: 450, date: new Date("2026-03-10") };

function setup() {
  const expenses = new InMemoryExpenseRepository();
  const receipts = new InMemoryReceiptStorage();
  const clock = fixedClock("2026-03-01");
  return {
    submit: new SubmitExpense(expenses, receipts, sequentialIds(), new InMemoryClientRepository(), new InMemoryProjectRepository()),
    list: new ListExpenses(expenses, new InMemoryUserRepository()),
    approve: new ApproveExpense(expenses, clock),
    reject: new RejectExpense(expenses, clock),
    pay: new PayExpense(expenses),
    getReceipt: new GetReceipt(expenses, receipts),
    reversePayment: new ReverseExpensePayment(expenses, clock),
  };
}

describe("Workflow des dépenses", () => {
  it("collaborateur soumet → dirigeant approuve → finance paie", async () => {
    const uc = setup();
    const { id } = await uc.submit.execute(member, { ...input, receipt: pdf });
    await uc.approve.execute(owner, id);
    await uc.pay.execute(finance, { expenseId: id, paidAt: new Date("2026-03-05") });

    const [expense] = await uc.list.execute(owner);
    expect(expense?.status).toBe("PAID");
  });

  it("le gestionnaire financier corrige un paiement erroné, le collaborateur non", async () => {
    const uc = setup();
    const { id } = await uc.submit.execute(member, { ...input, receipt: null });
    await uc.approve.execute(owner, id);
    await uc.pay.execute(finance, { expenseId: id, paidAt: new Date("2026-03-05") });

    await expect(uc.reversePayment.execute(member, id, "Erreur")).rejects.toThrow("droits");
    await uc.reversePayment.execute(finance, id, "Payé deux fois");

    const [expense] = await uc.list.execute(owner);
    expect(expense?.status).toBe("APPROVED");
    expect(expense?.reversal?.reason).toBe("Payé deux fois");
  });

  it("le gestionnaire financier ne peut pas approuver", async () => {
    const uc = setup();
    const { id } = await uc.submit.execute(member, { ...input, receipt: null });
    await expect(uc.approve.execute(finance, id)).rejects.toThrow("Vous n'avez pas les droits");
  });

  it("une dépense refusée ne peut pas être payée", async () => {
    const uc = setup();
    const { id } = await uc.submit.execute(member, { ...input, receipt: null });
    await uc.reject.execute(owner, id, "Hors budget");
    const payment = uc.pay.execute(finance, { expenseId: id, paidAt: new Date() });
    await expect(payment).rejects.toThrow("Une dépense refusée ne peut pas être payée.");
  });

  it("un collaborateur ne voit que ses propres dépenses", async () => {
    const uc = setup();
    await uc.submit.execute(finance, { ...input, receipt: null });
    await uc.submit.execute(member, { ...input, receipt: null });

    expect(await uc.list.execute(member)).toHaveLength(1);
    expect(await uc.list.execute(owner)).toHaveLength(2);
  });

  it("refuse un justificatif qui n'est ni un PDF ni une image", async () => {
    const uc = setup();
    const zip = { ...pdf, contentType: "application/zip" };
    const submission = uc.submit.execute(member, { ...input, receipt: zip });
    await expect(submission).rejects.toThrow("Le justificatif doit être un PDF ou une image.");
  });

  it("rend le justificatif à qui peut voir la dépense", async () => {
    const uc = setup();
    const { id } = await uc.submit.execute(member, { ...input, receipt: pdf });
    const file = await uc.getReceipt.execute(owner, id);
    expect(file.fileName).toBe("facture.pdf");
  });
});
