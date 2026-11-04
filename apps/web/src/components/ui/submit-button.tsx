"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

const variants = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
};

type Props = { children: React.ReactNode; variant?: keyof typeof variants };

/** Bouton d'envoi qui affiche un indicateur pendant le traitement. */
export function SubmitButton({ children, variant = "primary" }: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-60 ${variants[variant]}`}
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}
