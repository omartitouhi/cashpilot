import { EXPENSE_CATEGORIES, type ExpenseCategory } from "@cashpilot/application";
import { z } from "zod";

const categories = Object.keys(EXPENSE_CATEGORIES) as [ExpenseCategory, ...ExpenseCategory[]];

export const SubmitExpenseSchema = z.object({
  label: z.string().min(2, "Le libellé est trop court."),
  category: z.enum(categories, { error: "Choisissez une catégorie." }),
  amount: z.coerce.number().positive("Le montant doit être positif."),
  date: z.coerce.date({ error: "Date invalide." }),
  supplierId: z.string().optional().transform((v) => v || null), // « Aucun » = null
  projectId: z.string().optional().transform((v) => v || null),
});

export const RejectExpenseSchema = z.object({
  reason: z.string().min(3, "Indiquez le motif du refus."),
});
