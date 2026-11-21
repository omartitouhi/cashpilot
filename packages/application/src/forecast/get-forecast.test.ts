import { Company, Money } from "@cashpilot/domain";
import { describe, expect, it } from "vitest";
import { CreateInvoice } from "../invoice/create-invoice";
import { RecordPayment } from "../invoice/record-payment";
import { ValidateInvoice } from "../invoice/validate-invoice";
import { finance, member } from "../testing/actors";
import { clientsWithOne, fixedClock, sequentialIds } from "../testing/fakes";
import { InMemoryCompanyRepository } from "../testing/in-memory-company-repository";
import { InMemoryExpenseRepository } from "../testing/in-memory-expense-repository";
import { InMemoryInvoiceRepository } from "../testing/in-memory-invoice-repository";
import { GetTreasury } from "../treasury/get-treasury";
import { GetForecast } from "./get-forecast";

/** 5 000 DT en banque, facture de 3 000 DT échue le 10/03 dont 1 000 DT déjà reçus. */
async function setup() {
  const ids = sequentialIds();
  const companies = new InMemoryCompanyRepository();
  const invoices = new InMemoryInvoiceRepository();
  const expenses = new InMemoryExpenseRepository();
  await companies.save(Company.create({ id: "co-1", name: "Pixel", initialBalance: Money.fromDinars(5000) }));

  const clients = await clientsWithOne("co-1", "cl-1");
  const { id } = await new CreateInvoice(invoices, clients, ids).execute(finance, {
    clientId: "cl-1", amount: 3000, issueDate: new Date("2026-02-20"), dueDate: new Date("2026-03-10"),
  });
  await new ValidateInvoice(invoices).execute(finance, id);
  await new RecordPayment(invoices, ids).execute(finance, { invoiceId: id, amount: 1000, date: new Date("2026-02-25") });

  const treasury = new GetTreasury(companies, invoices, expenses);
  return { invoiceId: id, forecast: new GetForecast(treasury, invoices, expenses, fixedClock("2026-03-01")) };
}

describe("GetForecast", () => {
  it("compte le reste à payer, pas le montant déjà reçu", async () => {
    const view = await (await setup()).forecast.execute(finance);
    expect(view.startBalance).toBe(6_000_000); // 5 000 + 1 000 reçus
    expect(view.base.points.at(-1)?.balance).toBe(8_000_000); // + 2 000 restants, pas 3 000
    expect(view.simulated).toBeNull();
  });

  it("simule une dépense imprévue sans toucher à la projection initiale", async () => {
    const { forecast } = await setup();
    const extras = [{ label: "Serveur", amount: -7000, date: new Date("2026-03-05") }];
    const view = await forecast.execute(finance, { extras });

    expect(view.simulated?.shortages).toEqual([{ from: new Date("2026-03-05"), to: new Date("2026-03-09") }]);
    expect(view.base.shortages).toEqual([]);
  });

  it("le collaborateur n'a pas accès aux prévisions", async () => {
    await expect((await setup()).forecast.execute(member)).rejects.toThrow("Vous n'avez pas les droits");
  });
});
