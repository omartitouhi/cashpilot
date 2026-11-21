/** Un fichier justificatif (facture fournisseur, ticket...). */
export type ReceiptFile = {
  fileName: string;
  contentType: string;
  bytes: Uint8Array<ArrayBuffer>;
};

/** Où sont rangés les justificatifs. Renvoie un identifiant à l'enregistrement. */
export interface ReceiptStorage {
  save(companyId: string, file: ReceiptFile): Promise<string>;
  read(companyId: string, id: string): Promise<ReceiptFile | null>;
}
