import { Logo } from "@/components/layout/logo";

/** Mise en page des pages publiques : une carte centrée. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">{children}</div>
      </div>
    </main>
  );
}
