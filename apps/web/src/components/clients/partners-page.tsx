import { can, type PartnerKind } from "@cashpilot/application";
import { Building2, Users } from "lucide-react";
import { AccessDenied } from "@/components/ui/access-denied";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { useCases } from "@/container";
import { getCurrentUser } from "@/lib/current-user";
import { AddClientForm } from "./add-client-form";
import { ClientTable } from "./client-table";

const TEXTS = {
  CLIENT: {
    title: "Clients", description: "Coordonnées et historique de facturation.", basePath: "/clients",
    empty: "Ajoutez un client pour lui adresser des factures.", add: "Ajouter un client",
    permission: "invoices:view", icon: Users,
  },
  SUPPLIER: {
    title: "Fournisseurs", description: "Coordonnées et historique des dépenses payées.", basePath: "/fournisseurs",
    empty: "Ajoutez un fournisseur pour lui rattacher des dépenses.", add: "Ajouter un fournisseur",
    permission: "expenses:view-all", icon: Building2,
  },
} as const;

/** Liste des clients ou des fournisseurs, avec le formulaire d'ajout. */
export async function PartnersPage({ kind }: { kind: PartnerKind }) {
  const text = TEXTS[kind];
  const user = await getCurrentUser();
  if (!can(user.role, text.permission)) return <AccessDenied />;

  const partners = await useCases.listClients.execute(user, kind);

  return (
    <>
      <PageHeader title={text.title} description={text.description} />
      <div className="grid gap-6 xl:grid-cols-[1fr_22rem] xl:items-start">
        {partners.length === 0 ? (
          <EmptyState icon={text.icon} title={`Aucun ${kind === "CLIENT" ? "client" : "fournisseur"}`} description={text.empty} />
        ) : (
          <ClientTable clients={partners} basePath={text.basePath} />
        )}
        {can(user.role, "invoices:manage") && (
          <Card title={text.add}>
            <AddClientForm kind={kind} />
          </Card>
        )}
      </div>
    </>
  );
}
