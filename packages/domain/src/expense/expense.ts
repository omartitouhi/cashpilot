import { DomainError } from "../shared/domain-error";
import type { Money } from "../shared/money";
import type { ExpenseCategory } from "./expense-category";
import type { ExpenseStatus } from "./expense-status";

export type ExpenseProps = {
  id: string;
  companyId: string;
  submittedBy: string; // id de l'utilisateur
  label: string;
  category: ExpenseCategory;
  amount: Money;
  date: Date; // date à laquelle la dépense doit être payée
  receiptId: string | null; // justificatif (facultatif)
  supplierId: string | null; // fournisseur payé (facultatif)
  projectId: string | null; // projet auquel la dépense est imputée (facultatif)
  status: ExpenseStatus;
  // Traçabilité : qui a décidé ou payé, et quand.
  decidedBy: string | null;
  decidedAt: Date | null;
  rejectionReason: string | null;
  paidBy: string | null;
  paidAt: Date | null;
  // Correction d'un paiement erroné : le paiement annulé reste tracé ici (une seule fois).
  reversedPaidBy: string | null;
  reversedPaidAt: Date | null;
  reversedBy: string | null;
  reversedAt: Date | null;
  reversalReason: string | null;
};

export type NewExpense = Pick<
  ExpenseProps,
  "id" | "companyId" | "submittedBy" | "label" | "category" | "amount" | "date" | "receiptId" | "supplierId" | "projectId"
>;

export class Expense {
  private constructor(private props: ExpenseProps) {}

  static submit(data: NewExpense): Expense {
    if (data.label.trim().length < 2) {
      throw new DomainError("LIBELLE_TROP_COURT", "Le libellé est trop court.");
    }
    if (!data.amount.isPositive()) {
      throw new DomainError("MONTANT_NON_POSITIF", "Le montant doit être positif.");
    }
    return new Expense({
      ...data,
      label: data.label.trim(),
      status: "SUBMITTED",
      decidedBy: null,
      decidedAt: null,
      rejectionReason: null,
      paidBy: null,
      paidAt: null,
      reversedPaidBy: null,
      reversedPaidAt: null,
      reversedBy: null,
      reversedAt: null,
      reversalReason: null,
    });
  }

  static restore(props: ExpenseProps): Expense {
    return new Expense(props);
  }

  get id(): string {
    return this.props.id;
  }

  get status(): ExpenseStatus {
    return this.props.status;
  }

  attachReceipt(receiptId: string): void {
    this.assertSubmitted();
    this.props = { ...this.props, receiptId };
  }

  approve(userId: string, now: Date): void {
    this.assertSubmitted();
    this.props = { ...this.props, status: "APPROVED", decidedBy: userId, decidedAt: now };
  }

  reject(userId: string, reason: string, now: Date): void {
    this.assertSubmitted();
    if (reason.trim().length < 3) {
      throw new DomainError("MOTIF_OBLIGATOIRE", "Indiquez le motif du refus.");
    }
    this.props = {
      ...this.props,
      status: "REJECTED",
      decidedBy: userId,
      decidedAt: now,
      rejectionReason: reason.trim(),
    };
  }

  /** Seule une dépense approuvée peut être payée, et une seule fois. */
  markPaid(userId: string, paidAt: Date): void {
    if (this.props.status === "REJECTED") {
      throw new DomainError("DEPENSE_REFUSEE", "Une dépense refusée ne peut pas être payée.");
    }
    if (this.props.status === "PAID") {
      throw new DomainError("DEPENSE_DEJA_PAYEE", "Cette dépense est déjà payée.");
    }
    if (this.props.status !== "APPROVED") {
      throw new DomainError("DEPENSE_NON_APPROUVEE", "La dépense doit d'abord être approuvée.");
    }
    this.props = { ...this.props, status: "PAID", paidBy: userId, paidAt };
  }

  /**
   * Annule un paiement enregistré par erreur, sans l'effacer : il est conservé dans les
   * champs « reversed… » avec le motif, et la dépense redevient approuvée (à payer).
   */
  reversePayment(userId: string, reason: string, now: Date): void {
    if (this.props.status !== "PAID") {
      throw new DomainError("DEPENSE_NON_PAYEE", "Seule une dépense payée peut être corrigée.");
    }
    if (this.props.reversedAt) {
      throw new DomainError("DEPENSE_DEJA_CORRIGEE", "Le paiement de cette dépense a déjà été corrigé une fois.");
    }
    if (reason.trim().length < 3) {
      throw new DomainError("MOTIF_OBLIGATOIRE", "Indiquez le motif de la correction.");
    }
    this.props = {
      ...this.props,
      status: "APPROVED",
      reversedPaidBy: this.props.paidBy,
      reversedPaidAt: this.props.paidAt,
      reversedBy: userId,
      reversedAt: now,
      reversalReason: reason.trim(),
      paidBy: null,
      paidAt: null,
    };
  }

  snapshot(): ExpenseProps {
    return { ...this.props };
  }

  private assertSubmitted(): void {
    if (this.props.status !== "SUBMITTED") {
      throw new DomainError("DEPENSE_DEJA_TRAITEE", "Cette dépense a déjà été traitée.");
    }
  }
}
