import type { InvoiceRepository } from "@cashpilot/application";
import { prisma } from "@cashpilot/db";
import type { Invoice } from "@cashpilot/domain";
import { InvoiceMapper } from "./invoice-mapper";

export class PrismaInvoiceRepository implements InvoiceRepository {
  async save(invoice: Invoice): Promise<void> {
    const row = InvoiceMapper.toRow(invoice);
    // Facture et paiements sont écrits ensemble, ou pas du tout.
    // Les paiements existants ne sont jamais modifiés (skipDuplicates).
    await prisma.$transaction([
      prisma.invoice.upsert({ where: { id: row.id }, create: row, update: row }),
      prisma.payment.createMany({ data: InvoiceMapper.toPaymentRows(invoice), skipDuplicates: true }),
    ]);
  }

  async byId(companyId: string, id: string): Promise<Invoice | null> {
    const row = await prisma.invoice.findFirst({
      where: { id, companyId },
      include: { payments: true },
    });
    return row ? InvoiceMapper.toDomain(row) : null;
  }

  async allForCompany(companyId: string): Promise<Invoice[]> {
    const rows = await prisma.invoice.findMany({
      where: { companyId },
      include: { payments: true },
    });
    return rows.map(InvoiceMapper.toDomain);
  }

  async countForCompany(companyId: string): Promise<number> {
    return prisma.invoice.count({ where: { companyId } });
  }
}
