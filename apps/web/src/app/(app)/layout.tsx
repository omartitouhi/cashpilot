import { Sidebar } from "@/components/layout/sidebar";

/** Mise en page de l'espace connecté : menu à gauche, contenu à droite. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 px-4 py-6 md:px-10 md:py-8">{children}</main>
    </div>
  );
}
