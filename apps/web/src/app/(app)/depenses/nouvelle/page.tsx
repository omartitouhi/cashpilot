import { ExpenseForm } from "@/components/expenses/expense-form";
import { PageHeader } from "@/components/ui/page-header";
import { useCases } from "@/container";
import { getCurrentUser } from "@/lib/current-user";
import { toInputDate } from "@/lib/format-date";

export const dynamic = "force-dynamic";

export default async function NewExpensePage() {
  const suppliers = await useCases.listClients.execute(await getCurrentUser(), "SUPPLIER");

  return (
    <>
      <PageHeader title="Nouvelle dépense" description="Elle sera soumise au dirigeant pour approbation." />
      <ExpenseForm defaultDate={toInputDate(new Date())} suppliers={suppliers.map(({ id, name }) => ({ id, name }))} />
    </>
  );
}
