import { can } from "@cashpilot/application";
import { AddMemberForm } from "@/components/team/add-member-form";
import { MemberTable } from "@/components/team/member-table";
import { AccessDenied } from "@/components/ui/access-denied";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { useCases } from "@/container";
import { getCurrentUser } from "@/lib/current-user";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const user = await getCurrentUser();
  if (!can(user.role, "members:manage")) return <AccessDenied />;

  const members = await useCases.listMembers.execute(user);

  return (
    <>
      <PageHeader title="Équipe" description="Les membres de votre entreprise et leurs droits." />
      <div className="grid gap-6 xl:grid-cols-[1fr_22rem] xl:items-start">
        <MemberTable members={members} />
        <Card title="Ajouter un membre">
          <AddMemberForm />
        </Card>
      </div>
    </>
  );
}
