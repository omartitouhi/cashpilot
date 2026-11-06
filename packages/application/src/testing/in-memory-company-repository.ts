import type { Company } from "@cashpilot/domain";
import type { CompanyRepository } from "../ports/company-repository";

/** Repository d'entreprises en mémoire, pour les tests. */
export class InMemoryCompanyRepository implements CompanyRepository {
  private readonly items = new Map<string, Company>();

  async save(company: Company): Promise<void> {
    this.items.set(company.id, company);
  }

  async byId(id: string): Promise<Company | null> {
    return this.items.get(id) ?? null;
  }
}
