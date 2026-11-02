import { prisma } from "../src/index";

// Données de démonstration. Relancer le seed ne crée pas de doublons (upsert).
const COMPANY_ID = "demo-company";

async function main() {
  await prisma.company.upsert({
    where: { id: COMPANY_ID },
    update: {},
    create: { id: COMPANY_ID, name: "Agence Pixel", initialBalance: 5000 },
  });

  const clients = [
    { id: "demo-client-1", name: "Boulangerie Le Fournil", email: "contact@fournil.tn" },
    { id: "demo-client-2", name: "Clinique Les Oliviers", email: "admin@oliviers.tn" },
  ];

  for (const client of clients) {
    await prisma.client.upsert({
      where: { id: client.id },
      update: {},
      create: { ...client, companyId: COMPANY_ID },
    });
  }
}

main()
  .then(() => console.log("Données de démonstration créées."))
  .finally(() => prisma.$disconnect());
