import { randomUUID } from "node:crypto";
import type { IdGenerator } from "@cashpilot/application";

/** Identifiants UUID v4 aléatoires. */
export class UuidGenerator implements IdGenerator {
  next(): string {
    return randomUUID();
  }
}
