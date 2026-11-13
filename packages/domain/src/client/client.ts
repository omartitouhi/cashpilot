import { DomainError } from "../shared/domain-error";

export type ClientProps = {
  id: string;
  companyId: string;
  name: string;
  email: string | null;
  phone: string | null;
};

/** Un client de l'agence, à qui on adresse des factures. */
export class Client {
  private constructor(private readonly props: ClientProps) {}

  static create(props: ClientProps): Client {
    if (props.name.trim().length < 2) {
      throw new DomainError("NOM_TROP_COURT", "Le nom du client est trop court.");
    }
    return new Client({ ...props, name: props.name.trim() });
  }

  static restore(props: ClientProps): Client {
    return new Client(props);
  }

  get id(): string {
    return this.props.id;
  }

  snapshot(): ClientProps {
    return { ...this.props };
  }
}
