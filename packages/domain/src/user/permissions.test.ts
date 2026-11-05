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
});
