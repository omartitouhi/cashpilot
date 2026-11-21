"use client";

import { TriangleAlert } from "lucide-react";

type Props = { reset: () => void };

/** Affiché si une erreur inattendue survient dans une page. */
export default function ErrorPage({ reset }: Props) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-red-200 bg-white px-6 py-12 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-red-50 text-red-600">
        <TriangleAlert className="size-5" />
      </span>
      <h2 className="mt-4 font-medium">Une erreur est survenue</h2>
      <p className="mt-1 text-sm text-slate-500">Réessayez dans un instant.</p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
      >
        Réessayer
      </button>
    </div>
  );
}
