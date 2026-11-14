import { describe, expect, it } from "vitest";
import { Client } from "./client";

const base = { id: "cl-1", companyId: "co-1", kind: "CLIENT" as const, email: null, phone: null };

describe("Client", () => {
  it("nettoie les espaces autour du nom", () => {
    const client = Client.create({ ...base, name: "  Le Fournil " });
    expect(client.snapshot().name).toBe("Le Fournil");
  });

  it("refuse un nom trop court", () => {
    expect(() => Client.create({ ...base, name: "A" })).toThrow("Le nom est trop court.");
  });
});
