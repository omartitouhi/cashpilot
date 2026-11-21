import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email("Adresse email invalide."),
  password: z.string().min(1, "Saisissez votre mot de passe."),
});

export const RegisterSchema = z.object({
  companyName: z.string().min(2, "Le nom est trop court."),
  initialBalance: z.coerce.number({ error: "Montant invalide." }),
  ownerName: z.string().min(2, "Le nom est trop court."),
  email: z.email("Adresse email invalide."),
  password: z.string().min(8, "Au moins 8 caractères."),
});
