import type { Client } from "@cashpilot/domain";

/** Stockage des clients, toujours limité à une entreprise. */
export interface ClientRepository {
  save(client: Client): Promise<void>;
  byId(companyId: string, id: string): Promise<Client | null>;
  allForCompany(companyId: string): Promise<Client[]>;
}
