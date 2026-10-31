import { DomainError } from "../shared/domain-error";
import { Money } from "../shared/money";
import type { InvoiceStatus } from "./invoice-status";
import type { Payment } from "./payment";

export type InvoiceProps = {
  id: string;
  companyId: string;
  clientId: string;
  number: string;
  amount: Money;
  issueDate: Date;
  dueDate: Date;
  status: InvoiceStatus;
  payments: Payment[];
};

export type NewInvoice = Omit<InvoiceProps, "status" | "payments">;

export class Invoice {
  private constructor(private props: InvoiceProps) {}

  /** Crée une facture en brouillon, après vérification des règles. */
  static createDraft(data: NewInvoice): Invoice {
    if (!data.amount.isPositive()) {
      throw new DomainError("MONTANT_NON_POSITIF", "Le montant doit être positif.");
    }
    if (data.dueDate < data.issueDate) {
      throw new DomainError("ECHEANCE_INVALIDE", "L'échéance doit suivre l'émission.");
    }
    return new Invoice({ ...data, status: "DRAFT", payments: [] });
  }

  /** Recharge une facture déjà enregistrée (utilisé par la base de données). */
  static restore(props: InvoiceProps): Invoice {
    return new Invoice(props);
  }

  get id(): string {
    return this.props.id;
  }

  get status(): InvoiceStatus {
    return this.props.status;
  }

  validate(): void {
    if (this.props.status !== "DRAFT") {
      throw new DomainError("FACTURE_DEJA_VALIDEE", "Seul un brouillon peut être validé.");
    }
    this.props.status = "ISSUED";
  }

  cancel(): void {
    if (this.props.payments.length > 0) {
      throw new DomainError("FACTURE_AVEC_PAIEMENT", "Une facture payée ne peut pas être annulée.");
    }
    if (this.props.status === "CANCELLED") {
      throw new DomainError("FACTURE_DEJA_ANNULEE", "La facture est déjà annulée.");
    }
    this.props.status = "CANCELLED";
  }

  recordPayment(payment: Payment): void {
    if (this.props.status !== "ISSUED") {
      throw new DomainError("FACTURE_NON_PAYABLE", "Cette facture ne peut pas recevoir de paiement.");
    }
    if (!payment.amount.isPositive()) {
      throw new DomainError("MONTANT_NON_POSITIF", "Le montant doit être positif.");
    }
    if (payment.amount.isGreaterThan(this.remainingAmount())) {
      throw new DomainError("PAIEMENT_TROP_ELEVE", "Le paiement dépasse le reste à payer.");
    }
    this.props.payments.push(payment);
    if (this.remainingAmount().isZero()) {
      this.props.status = "PAID";
    }
  }

  paidAmount(): Money {
    return this.props.payments.reduce((total, p) => total.add(p.amount), Money.zero());
  }

  remainingAmount(): Money {
    return this.props.amount.subtract(this.paidAmount());
  }

  isOverdue(today: Date): boolean {
    return this.props.status === "ISSUED" && this.props.dueDate < today;
  }

  /** Copie en lecture seule de l'état, pour l'affichage ou la sauvegarde. */
  snapshot(): InvoiceProps {
    return { ...this.props, payments: [...this.props.payments] };
  }
}
