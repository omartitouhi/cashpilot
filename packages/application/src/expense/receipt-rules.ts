import { DomainError } from "@cashpilot/domain";
import type { ReceiptFile } from "../ports/receipt-storage";

export const RECEIPT_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/webp"];
export const RECEIPT_MAX_BYTES = 2 * 1024 * 1024; // 2 Mo

/** Un justificatif doit être un PDF ou une image de 2 Mo maximum. */
export function assertValidReceipt(file: ReceiptFile): void {
  if (!RECEIPT_TYPES.includes(file.contentType)) {
    throw new DomainError("JUSTIFICATIF_FORMAT", "Le justificatif doit être un PDF ou une image.");
  }
  if (file.bytes.length > RECEIPT_MAX_BYTES) {
    throw new DomainError("JUSTIFICATIF_TROP_LOURD", "Le justificatif ne doit pas dépasser 2 Mo.");
  }
}
