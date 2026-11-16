import { DomainError } from "../shared/domain-error";
import { Money } from "../shared/money";

export type ProjectProps = {
  id: string;
  companyId: string;
  clientId: string; // le client pour qui l'agence réalise le projet
  name: string;
};

/** Un projet client de l'agence (site web, campagne, application...). */
export class Project {
  private constructor(private readonly props: ProjectProps) {}

  static create(props: ProjectProps): Project {
    if (props.name.trim().length < 2) {
      throw new DomainError("NOM_TROP_COURT", "Le nom du projet est trop court.");
    }
    return new Project({ ...props, name: props.name.trim() });
  }

  static restore(props: ProjectProps): Project {
    return new Project(props);
  }

  get id(): string {
    return this.props.id;
  }

  snapshot(): ProjectProps {
    return { ...this.props };
  }
}

export type Profitability = { revenue: Money; costs: Money; margin: Money; marginRate: number | null };

/**
 * Rentabilité d'un projet : chiffre d'affaires facturé - coûts engagés.
 * marginRate est en pourcentage, null s'il n'y a encore aucun chiffre d'affaires.
 */
export function profitability(revenues: Money[], costs: Money[]): Profitability {
  const sum = (list: Money[]) => list.reduce((total, m) => total.add(m), Money.zero());
  const revenue = sum(revenues);
  const cost = sum(costs);
  const margin = revenue.subtract(cost);
  const marginRate = revenue.isZero() ? null : Math.round((margin.millimes / revenue.millimes) * 1000) / 10;
  return { revenue, costs: cost, margin, marginRate };
}
