import { z } from "zod";

export const AddMemberSchema = z.object({
  name: z.string().min(2, "Le nom est trop court."),
  email: z.email("Adresse email invalide."),
  password: z.string().min(8, "Au moins 8 caractères."),
  role: z.enum(["OWNER", "FINANCE", "MEMBER"], { error: "Choisissez un rôle." }),
});
