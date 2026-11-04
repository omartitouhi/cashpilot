"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/action-state";
import { FormMessage } from "./form-message";
import { SubmitButton } from "./submit-button";

type Props = {
  action: (state: ActionState) => Promise<ActionState>;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
};

/** Un bouton qui lance une Server Action et affiche son éventuelle erreur. */
export function ActionButton({ action, variant, children }: Props) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <SubmitButton variant={variant}>{children}</SubmitButton>
      <FormMessage message={state.message} />
    </form>
  );
}
