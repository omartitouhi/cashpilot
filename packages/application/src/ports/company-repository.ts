import type { Company } from "@cashpilot/domain";

export interface CompanyRepository {
  save(company: Company): Promise<void>;
  byId(id: string): Promise<Company | null>;
}
