import { ExpenseForm } from "@/components/expenses/expense-form";
import { PageHeader } from "@/components/ui/page-header";
import { toInputDate } from "@/lib/format-date";

export const dynamic = "force-dynamic";

export default function NewExpensePage() {
  return (
    <>
      <PageHeader title="Nouvelle dépense" description="Elle sera soumise au dirigeant pour approbation." />
      <ExpenseForm defaultDate={toInputDate(new Date())} />
    </>
  );
}
