import { describe, expect, it } from "vitest";
import { assertValidPassword } from "./password-policy";
import { User } from "./user";

const base = { id: "u-1", companyId: "co-1", name: "Sami", passwordHash: "hash", role: "OWNER" as const };

describe("User", () => {
  it("met l'email en minuscules", () => {
    const user = User.create({ ...base, email: " Sami@Pixel.TN " });
    expect(user.snapshot().email).toBe("sami@pixel.tn");
  });

  it("refuse un email sans @", () => {
    expect(() => User.create({ ...base, email: "sami" })).toThrow("L'adresse email est invalide.");
  });

  it("refuse un mot de passe de moins de 8 caractères", () => {
    expect(() => assertValidPassword("1234567")).toThrow();
    expect(() => assertValidPassword("12345678")).not.toThrow();
  });
});
