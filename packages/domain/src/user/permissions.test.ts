import { describe, expect, it } from "vitest";
import { can } from "./permissions";

describe("permissions", () => {
  it("le dirigeant peut gérer l'équipe", () => {
    expect(can("OWNER", "members:manage")).toBe(true);
  });

  it("le gestionnaire financier gère les factures mais pas l'équipe", () => {
    expect(can("FINANCE", "invoices:manage")).toBe(true);
    expect(can("FINANCE", "members:manage")).toBe(false);
  });

  it("le collaborateur ne voit pas les factures", () => {
    expect(can("MEMBER", "invoices:view")).toBe(false);
  });

  it("seul le dirigeant approuve les dépenses", () => {
    expect(can("OWNER", "expenses:approve")).toBe(true);
    expect(can("FINANCE", "expenses:approve")).toBe(false);
    expect(can("MEMBER", "expenses:approve")).toBe(false);
  });

  it("tout le monde peut soumettre une dépense", () => {
    expect(can("MEMBER", "expenses:submit")).toBe(true);
  });
});
