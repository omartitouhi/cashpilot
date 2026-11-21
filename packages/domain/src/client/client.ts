import { DomainError } from "../shared/domain-error";

/** Un tiers est soit un client (on le facture), soit un fournisseur (on le paie). */
export type PartnerKind = "CLIENT" | "SUPPLIER";

export type ClientProps = {
  id: string;
  companyId: string;
  kind: PartnerKind;
  name: string;
  email: string | null;
  phone: string | null;
};

/** Un tiers de l'agence : client ou fournisseur. */
export class Client {
  private constructor(private readonly props: ClientProps) {}

  static create(props: ClientProps): Client {
    if (props.name.trim().length < 2) {
      throw new DomainError("NOM_TROP_COURT", "Le nom est trop court.");
    }
    return new Client({ ...props, name: props.name.trim() });
  }

  static restore(props: ClientProps): Client {
    return new Client(props);
  }

  get id(): string {
    return this.props.id;
  }

  get kind(): PartnerKind {
    return this.props.kind;
  }

  snapshot(): ClientProps {
    return { ...this.props };
  }
}
