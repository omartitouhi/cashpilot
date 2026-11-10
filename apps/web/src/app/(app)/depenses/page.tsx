import { can } from "@cashpilot/application";
import { Plus, Receipt } from "lucide-react";
import { ExpenseTable } from "@/components/expenses/expense-table";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { useCases } from "@/container";
import { getCurrentUser } from "@/lib/current-user";

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  const user = await getCurrentUser();
  const expenses = await useCases.listExpenses.execute(user);
  const description = can(user.role, "expenses:view-all")
    ? "Les dépenses de l'entreprise et leur validation."
    : "Vos demandes de dépenses et leur suivi.";

  return (
    <>
      <PageHeader
        title="Dépenses"
        description={description}
        action={
          <ButtonLink href="/depenses/nouvelle">
            <Plus className="size-4" /> Nouvelle dépense
          </ButtonLink>
        }
      />
      {expenses.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="Aucune dépense pour l'instant"
          description="Soumettez une dépense : elle sera validée par le dirigeant puis payée."
        />
      ) : (
        <ExpenseTable expenses={expenses} />
      )}
    </>
  );
}
