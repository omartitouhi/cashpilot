import bcrypt from "bcryptjs";
import { prisma } from "../src/index";

// Données de démonstration. Relancer le seed ne crée pas de doublons (upsert).
const COMPANY_ID = "demo-company";
const DEMO_PASSWORD = "demo1234"; // comptes de démo uniquement, listés dans le README

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

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const users = [
    { id: "demo-owner", name: "Sami Ben Ali", email: "dirigeant@pixel.tn", role: "OWNER" },
    { id: "demo-finance", name: "Ines Trabelsi", email: "finance@pixel.tn", role: "FINANCE" },
    { id: "demo-member", name: "Youssef Gharbi", email: "collaborateur@pixel.tn", role: "MEMBER" },
  ] as const;

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: { ...user, passwordHash, companyId: COMPANY_ID },
    });
  }
}

main()
  .then(() => console.log("Données de démonstration créées."))
  .finally(() => prisma.$disconnect());
