import { DomainError } from "../shared/domain-error";
import type { Role } from "./permissions";

export type UserProps = {
  id: string;
  companyId: string;
  name: string;
  email: string;
  passwordHash: string; // jamais le mot de passe en clair
  role: Role;
};

/** Un membre d'une entreprise. Chaque utilisateur appartient à une seule entreprise. */
export class User {
  private constructor(private readonly props: UserProps) {}

  static create(props: UserProps): User {
    const email = props.email.trim().toLowerCase();
    if (!email.includes("@")) {
      throw new DomainError("EMAIL_INVALIDE", "L'adresse email est invalide.");
    }
    if (props.name.trim().length < 2) {
      throw new DomainError("NOM_TROP_COURT", "Le nom est trop court.");
    }
    return new User({ ...props, email, name: props.name.trim() });
  }

  static restore(props: UserProps): User {
    return new User(props);
  }

  get id(): string {
    return this.props.id;
  }

  snapshot(): UserProps {
    return { ...this.props };
  }
}
