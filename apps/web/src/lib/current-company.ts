/**
 * Entreprise de l'utilisateur connecté.
 * Temporaire : on utilise l'entreprise de démonstration
 * jusqu'à l'ajout de l'authentification.
 */
export async function getCurrentCompanyId(): Promise<string> {
  return "demo-company";
}
