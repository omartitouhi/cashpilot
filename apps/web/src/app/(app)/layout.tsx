import { Sidebar } from "@/components/layout/sidebar";
import { getCurrentUser } from "@/lib/current-user";

/** Mise en page de l'espace connecté : menu à gauche, contenu à droite. */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar user={user} />
      {/* min-w-0 : un tableau large défile dans sa carte, pas toute la page. */}
      <main className="min-w-0 flex-1 px-4 py-6 md:px-10 md:py-8">{children}</main>
    </div>
  );
}
