import { describe, expect, it } from "vitest";
import { fakeHasher, sequentialIds } from "../testing/fakes";
import { InMemoryCompanyRepository } from "../testing/in-memory-company-repository";
import { InMemoryUserRepository } from "../testing/in-memory-user-repository";
import { Login } from "./login";
import { RegisterCompany } from "./register-company";

const input = {
  companyName: "Agence Pixel",
  initialBalance: 5000,
  ownerName: "Sami",
  email: "sami@pixel.tn",
  password: "motdepasse",
};

function setup() {
  const users = new InMemoryUserRepository();
  const register = new RegisterCompany(new InMemoryCompanyRepository(), users, fakeHasher, sequentialIds());
  return { register, login: new Login(users, fakeHasher) };
}

describe("RegisterCompany", () => {
  it("crée l'entreprise avec son dirigeant", async () => {
    const owner = await setup().register.execute(input);
    expect(owner.role).toBe("OWNER");
  });

  it("refuse un email déjà utilisé", async () => {
    const { register } = setup();
    await register.execute(input);
    await expect(register.execute(input)).rejects.toThrow("Cette adresse email est déjà utilisée.");
  });
});

describe("Login", () => {
  it("connecte avec le bon mot de passe, même si l'email a des majuscules", async () => {
    const { register, login } = setup();
    await register.execute(input);
    const user = await login.execute({ email: "Sami@Pixel.tn", password: "motdepasse" });
    expect(user.name).toBe("Sami");
  });

  it("refuse un mauvais mot de passe", async () => {
    const { register, login } = setup();
    await register.execute(input);
    const attempt = login.execute({ email: "sami@pixel.tn", password: "faux" });
    await expect(attempt).rejects.toThrow("Email ou mot de passe incorrect.");
  });
});
