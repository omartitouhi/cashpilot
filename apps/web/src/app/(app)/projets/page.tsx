import { can } from "@cashpilot/application";
import { FolderKanban } from "lucide-react";
import { AddProjectForm } from "@/components/projects/add-project-form";
import { ProjectTable } from "@/components/projects/project-table";
import { AccessDenied } from "@/components/ui/access-denied";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { useCases } from "@/container";
import { getCurrentUser } from "@/lib/current-user";

export const dynamic = "force-dynamic";

/** Fonctionnalité du secteur « agence digitale » : la rentabilité de chaque projet client. */
export default async function ProjectsPage() {
  const user = await getCurrentUser();
  if (!can(user.role, "invoices:view")) return <AccessDenied />;

  const [projects, clients] = await Promise.all([
    useCases.listProjects.execute(user),
    useCases.listClients.execute(user),
  ]);
  const clientNames = new Map(clients.map((c) => [c.id, c.name]));

  return (
    <>
      <PageHeader
        title="Projets"
        description="Rentabilité par projet : factures validées moins dépenses approuvées ou payées."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_22rem] xl:items-start">
        {projects.length === 0 ? (
          <EmptyState icon={FolderKanban} title="Aucun projet"
            description="Créez un projet, puis rattachez-y factures et dépenses pour suivre sa marge." />
        ) : (
          <ProjectTable projects={projects} clientNames={clientNames} />
        )}
        {can(user.role, "invoices:manage") && (
          <Card title="Nouveau projet">
            <AddProjectForm clients={clients.map(({ id, name }) => ({ id, name }))} />
          </Card>
        )}
      </div>
    </>
  );
}
