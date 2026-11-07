import { Wallet } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-8 items-center justify-center rounded-lg bg-brand-500 text-white">
        <Wallet className="size-4" />
      </span>
      <span className="text-lg font-semibold">CashPilot</span>
    </div>
  );
}
