import type { ReceiptFile, ReceiptStorage } from "../ports/receipt-storage";

/** Stockage de justificatifs en mémoire, pour les tests. */
export class InMemoryReceiptStorage implements ReceiptStorage {
  private readonly files = new Map<string, { companyId: string; file: ReceiptFile }>();

  async save(companyId: string, file: ReceiptFile): Promise<string> {
    const id = `receipt-${this.files.size + 1}`;
    this.files.set(id, { companyId, file });
    return id;
  }

  async read(companyId: string, id: string): Promise<ReceiptFile | null> {
    const entry = this.files.get(id);
    return entry?.companyId === companyId ? entry.file : null;
  }
}
