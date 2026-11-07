import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <>
      <h1 className="text-xl font-semibold">Connexion</h1>
      <p className="mt-1 mb-6 text-sm text-slate-500">Accédez à la trésorerie de votre entreprise.</p>
      <LoginForm />
      <p className="mt-6 text-center text-sm text-slate-500">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-medium text-brand-700 hover:underline">
          Créer une entreprise
        </Link>
      </p>
    </>
  );
}
