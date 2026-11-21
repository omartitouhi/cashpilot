import { describe, expect, it } from "vitest";
import type { Actor } from "../shared/actor";
import { fakeHasher, sequentialIds } from "../testing/fakes";
import { InMemoryUserRepository } from "../testing/in-memory-user-repository";
import { AddMember } from "./add-member";
import { ListMembers } from "./list-members";

const owner: Actor = { userId: "u-1", companyId: "co-1", role: "OWNER" };
const finance: Actor = { userId: "u-2", companyId: "co-1", role: "FINANCE" };
const newMember = { name: "Lina", email: "lina@pixel.tn", password: "motdepasse", role: "MEMBER" as const };

describe("AddMember", () => {
  it("le dirigeant ajoute un membre à son entreprise", async () => {
    const users = new InMemoryUserRepository();
    await new AddMember(users, fakeHasher, sequentialIds()).execute(owner, newMember);

    const members = await new ListMembers(users).execute(owner);
    expect(members).toEqual([{ id: "id-1", name: "Lina", email: "lina@pixel.tn", role: "MEMBER" }]);
  });

  it("le gestionnaire financier ne peut pas ajouter de membre", async () => {
    const addMember = new AddMember(new InMemoryUserRepository(), fakeHasher, sequentialIds());
    await expect(addMember.execute(finance, newMember)).rejects.toThrow("Vous n'avez pas les droits");
  });
});
