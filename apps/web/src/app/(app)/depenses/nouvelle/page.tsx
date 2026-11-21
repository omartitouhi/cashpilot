import { ExpenseForm } from "@/components/expenses/expense-form";
import { PageHeader } from "@/components/ui/page-header";
import { useCases } from "@/container";
import { getCurrentUser } from "@/lib/current-user";
import { toInputDate } from "@/lib/format-date";

export const dynamic = "force-dynamic";

export default async function NewExpensePage() {
  const user = await getCurrentUser();
  const [suppliers, projects] = await Promise.all([
    useCases.listClients.execute(user, "SUPPLIER"),
    useCases.listProjectNames.execute(user),
  ]);

  return (
    <>
      <PageHeader title="Nouvelle dépense" description="Elle sera soumise au dirigeant pour approbation." />
      <ExpenseForm defaultDate={toInputDate(new Date())} suppliers={suppliers.map(({ id, name }) => ({ id, name }))}
        projects={projects.map(({ id, name }) => ({ id, name }))} />
    </>
  );
}
