import { randomUUID } from "node:crypto";
import type { ReceiptFile, ReceiptStorage } from "@cashpilot/application";
import { prisma } from "@cashpilot/db";

/** Justificatifs rangés dans PostgreSQL. */
export class PrismaReceiptStorage implements ReceiptStorage {
  async save(companyId: string, file: ReceiptFile): Promise<string> {
    const id = randomUUID();
    const { fileName, contentType, bytes } = file;
    await prisma.receipt.create({ data: { id, companyId, fileName, contentType, data: bytes } });
    return id;
  }

  async read(companyId: string, id: string): Promise<ReceiptFile | null> {
    const row = await prisma.receipt.findFirst({ where: { id, companyId } });
    return row ? { fileName: row.fileName, contentType: row.contentType, bytes: row.data } : null;
  }
}
