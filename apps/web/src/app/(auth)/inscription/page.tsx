import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-xl font-semibold">Créer votre entreprise</h1>
      <p className="mt-1 mb-6 text-sm text-slate-500">
        Vous serez le dirigeant et pourrez ensuite inviter votre équipe.
      </p>
      <RegisterForm />
      <p className="mt-6 text-center text-sm text-slate-500">
        Déjà inscrit ?{" "}
        <Link href="/connexion" className="font-medium text-brand-700 hover:underline">
          Se connecter
        </Link>
      </p>
    </>
  );
}
