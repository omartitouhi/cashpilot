import { DomainError } from "../shared/domain-error";
import type { Money } from "../shared/money";

export type CompanyProps = {
  id: string;
  name: string;
  initialBalance: Money; // solde de départ de la trésorerie
};

/** L'espace d'une entreprise : ses données ne sont visibles que par ses membres. */
export class Company {
  private constructor(private readonly props: CompanyProps) {}

  static create(props: CompanyProps): Company {
    if (props.name.trim().length < 2) {
      throw new DomainError("NOM_TROP_COURT", "Le nom de l'entreprise est trop court.");
    }
    return new Company({ ...props, name: props.name.trim() });
  }

  static restore(props: CompanyProps): Company {
    return new Company(props);
  }

  get id(): string {
    return this.props.id;
  }

  snapshot(): CompanyProps {
    return { ...this.props };
  }
}
