import type { User } from "@cashpilot/domain";

export interface UserRepository {
  save(user: User): Promise<void>;
  byEmail(email: string): Promise<User | null>;
  allForCompany(companyId: string): Promise<User[]>;
}
