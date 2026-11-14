import { Client } from "@cashpilot/domain";
import type { Clock } from "../ports/clock";
import type { IdGenerator } from "../ports/id-generator";
import type { PasswordHasher } from "../ports/password-hasher";
import { InMemoryClientRepository } from "./in-memory-client-repository";

/** Horloge figée à une date choisie. */
export function fixedClock(isoDate: string): Clock {
  return { now: () => new Date(isoDate) };
}

/** Générateur d'identifiants prévisibles : id-1, id-2, ... */
export function sequentialIds(): IdGenerator {
  let count = 0;
  return { next: () => `id-${++count}` };
}

/** Faux hachage, lisible dans les tests : « secret » → « hashed:secret ». */
export const fakeHasher: PasswordHasher = {
  hash: async (password) => `hashed:${password}`,
  verify: async (password, hash) => hash === `hashed:${password}`,
};

/** Repository contenant un seul client, rattaché à l'entreprise donnée. */
export async function clientsWithOne(companyId: string, clientId: string) {
  const clients = new InMemoryClientRepository();
  await clients.save(Client.create({ id: clientId, companyId, kind: "CLIENT", name: "Client test", email: null, phone: null }));
  return clients;
}
