/**
 * Workflow d'une dépense :
 * SUBMITTED (soumise) → APPROVED (approuvée) → PAID (payée)
 *                     ↘ REJECTED (refusée, définitif)
 */
export type ExpenseStatus = "SUBMITTED" | "APPROVED" | "REJECTED" | "PAID";
