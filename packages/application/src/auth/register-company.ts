import { assertValidPassword, Company, Money, User } from "@cashpilot/domain";
import type { CompanyRepository } from "../ports/company-repository";
import type { IdGenerator } from "../ports/id-generator";
import type { PasswordHasher } from "../ports/password-hasher";
import type { UserRepository } from "../ports/user-repository";
import { assertEmailAvailable } from "./assert-email-available";
import { toSessionUser, type SessionUser } from "./session-user";

export type RegisterCompanyInput = {
  companyName: string;
  initialBalance: number; // en dinars
  ownerName: string;
  email: string;
  password: string;
};

/** Crée une entreprise et son dirigeant, qui est ensuite connecté. */
export class RegisterCompany {
  constructor(
    private readonly companies: CompanyRepository,
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly ids: IdGenerator,
  ) {}

  async execute(input: RegisterCompanyInput): Promise<SessionUser> {
    assertValidPassword(input.password);
    await assertEmailAvailable(this.users, input.email);

    // On construit les deux entités avant d'enregistrer quoi que ce soit.
    const company = Company.create({
      id: this.ids.next(),
      name: input.companyName,
      initialBalance: Money.fromDinars(input.initialBalance),
    });
    const owner = User.create({
      id: this.ids.next(),
      companyId: company.id,
      name: input.ownerName,
      email: input.email,
      passwordHash: await this.hasher.hash(input.password),
      role: "OWNER",
    });

    await this.companies.save(company);
    await this.users.save(owner);
    return toSessionUser(owner);
  }
}
