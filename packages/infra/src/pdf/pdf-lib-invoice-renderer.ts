import type { InvoiceDocument, InvoicePdfRenderer } from "@cashpilot/application";
import { PDFDocument, rgb, StandardFonts, type PDFFont, type PDFPage } from "pdf-lib";

const BRAND = rgb(0.055, 0.522, 0.451); // #0e8573
const MUTED = rgb(0.392, 0.455, 0.545); // slate-500
const INK = rgb(0.059, 0.09, 0.165); // slate-900

const STATUS: Record<string, string> = { DRAFT: "BROUILLON", ISSUED: "", PAID: "PAYÉE", CANCELLED: "ANNULÉE" };

// Les polices standard du PDF ne connaissent pas les espaces insécables d'Intl.
const clean = (text: string) => text.replace(/[  ]/g, " ");
const money = (millimes: number) =>
  clean(new Intl.NumberFormat("fr-TN", { style: "currency", currency: "TND", minimumFractionDigits: 3 }).format(millimes / 1000));
const date = (d: Date) => clean(new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "UTC" }).format(d));

/** Facture A4 sobre : en-tête, client, montants, paiements reçus. */
export class PdfLibInvoiceRenderer implements InvoicePdfRenderer {
  async render({ companyName, client, invoice }: InvoiceDocument): Promise<Uint8Array<ArrayBuffer>> {
    const pdf = await PDFDocument.create();
    const page = pdf.addPage([595, 842]); // A4 en points
    const regular = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
    const text = (s: string, x: number, y: number, size = 10, font = regular, color = INK) =>
      page.drawText(clean(s), { x, y, size, font, color });

    // En-tête
    text(companyName, 50, 780, 18, bold, BRAND);
    textRight(page, `Facture ${invoice.number}`, 545, 780, 16, bold);
    if (STATUS[invoice.status]) textRight(page, STATUS[invoice.status] ?? "", 545, 762, 10, bold, MUTED);
    text(`Émise le ${date(invoice.issueDate)}`, 50, 740, 10, regular, MUTED);
    text(`Échéance : ${date(invoice.dueDate)}`, 50, 725, 10, regular, MUTED);

    // Client
    text("Facturé à", 50, 680, 9, bold, MUTED);
    text(client.name, 50, 664, 12, bold);
    [client.email, client.phone].filter(Boolean).forEach((line, i) => text(line ?? "", 50, 648 - i * 14));

    // Montants
    page.drawLine({ start: { x: 50, y: 590 }, end: { x: 545, y: 590 }, color: MUTED, thickness: 0.5 });
    const rows: [string, number, boolean][] = [
      ["Montant de la facture", invoice.amount, false],
      ["Déjà réglé", invoice.paid, false],
      ["Reste à payer", invoice.remaining, true],
    ];
    rows.forEach(([label, value, strong], i) => {
      const y = 565 - i * 22;
      text(label, 50, y, 11, strong ? bold : regular);
      textRight(page, money(value), 545, y, 11, strong ? bold : regular);
    });

    // Paiements reçus
    if (invoice.payments.length > 0) {
      text("Paiements reçus", 50, 480, 9, bold, MUTED);
      invoice.payments.forEach((p, i) => {
        text(date(p.date), 50, 464 - i * 16);
        textRight(page, money(p.amount), 545, 464 - i * 16, 10, regular);
      });
    }

    text("Document généré par CashPilot", 50, 40, 8, regular, MUTED);
    return pdf.save() as Promise<Uint8Array<ArrayBuffer>>;
  }
}

/** Écrit un texte aligné à droite sur la coordonnée x. */
function textRight(page: PDFPage, s: string, x: number, y: number, size: number, font: PDFFont, color = INK) {
  const value = clean(s);
  page.drawText(value, { x: x - font.widthOfTextAtSize(value, size), y, size, font, color });
}
