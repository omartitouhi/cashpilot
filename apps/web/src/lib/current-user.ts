import type { SessionUser } from "@cashpilot/application";
import { redirect } from "next/navigation";
import { readSession } from "./session";

/** L'utilisateur connecté. Sans session, on part vers la page de connexion. */
export async function getCurrentUser(): Promise<SessionUser> {
  const user = await readSession();
  if (!user) redirect("/connexion");
  return user;
}
