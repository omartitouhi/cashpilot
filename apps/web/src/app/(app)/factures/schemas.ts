import { z } from "zod";

// Zod vérifie la FORME des données reçues. Les règles métier
// (échéance après émission, etc.) sont vérifiées par le domaine.
export const CreateInvoiceSchema = z.object({
  clientId: z.string().min(1, "Choisissez un client."),
  projectId: z.string().optional().transform((v) => v || null), // « Aucun » = null
  amount: z.coerce.number().positive("Le montant doit être positif."),
  issueDate: z.coerce.date({ error: "Date invalide." }),
  dueDate: z.coerce.date({ error: "Date invalide." }),
});

export const RecordPaymentSchema = z.object({
  amount: z.coerce.number().positive("Le montant doit être positif."),
  date: z.coerce.date({ error: "Date invalide." }),
});
