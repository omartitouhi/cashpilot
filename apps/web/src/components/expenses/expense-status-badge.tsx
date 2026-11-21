import type { ExpenseStatus } from "@cashpilot/application";
import { Badge, type BadgeTone } from "@/components/ui/badge";

const STATUSES: Record<ExpenseStatus, { label: string; tone: BadgeTone }> = {
  SUBMITTED: { label: "À valider", tone: "warning" },
  APPROVED: { label: "Approuvée", tone: "info" },
  REJECTED: { label: "Refusée", tone: "danger" },
  PAID: { label: "Payée", tone: "success" },
};

export function ExpenseStatusBadge({ status }: { status: ExpenseStatus }) {
  const { label, tone } = STATUSES[status];
  return <Badge tone={tone}>{label}</Badge>;
}
