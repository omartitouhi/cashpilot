import bcrypt from "bcryptjs";
import { prisma } from "../src/index";

// Données de démonstration. Relancer le seed ne crée pas de doublons (upsert).
// Les dates sont relatives au jour du seed : retards et prévisions restent parlants.
const COMPANY_ID = "demo-company";
const DEMO_PASSWORD = "demo1234"; // comptes de démo uniquement, listés dans le README

/** Aujourd'hui + n jours, à minuit UTC. */
function day(n: number): Date {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + n));
}

const company = { id: COMPANY_ID, name: "Agence Pixel", initialBalance: 5000 };

const partners = [
  { id: "demo-client-1", kind: "CLIENT", name: "Boulangerie Le Fournil", email: "contact@fournil.tn" },
  { id: "demo-client-2", kind: "CLIENT", name: "Clinique Les Oliviers", email: "admin@oliviers.tn" },
  { id: "demo-supplier-1", kind: "SUPPLIER", name: "Figma", email: "billing@figma.example" },
  { id: "demo-supplier-2", kind: "SUPPLIER", name: "Karim, développeur freelance", email: null },
] as const;

const users = [
  { id: "demo-owner", name: "Sami Ben Ali", email: "dirigeant@pixel.tn", role: "OWNER" },
  { id: "demo-finance", name: "Ines Trabelsi", email: "finance@pixel.tn", role: "FINANCE" },
  { id: "demo-member", name: "Youssef Gharbi", email: "collaborateur@pixel.tn", role: "MEMBER" },
] as const;

const projects = [
  { id: "demo-project-1", clientId: "demo-client-1", name: "Site e-commerce" },
  { id: "demo-project-2", clientId: "demo-client-2", name: "Campagne réseaux sociaux" },
];

const invoices = [
  // En retard et partiellement payée : 4 000 DT restent attendus.
  { id: "demo-inv-1", number: "F-0001", clientId: "demo-client-1", projectId: "demo-project-1", amount: 6000,
    issueDate: day(-40), dueDate: day(-10), status: "ISSUED", payments: [{ id: "demo-pay-1", amount: 2000, date: day(-15) }] },
  // Payée en totalité.
  { id: "demo-inv-2", number: "F-0002", clientId: "demo-client-1", projectId: "demo-project-1", amount: 4000,
    issueDate: day(-35), dueDate: day(-25), status: "PAID", payments: [{ id: "demo-pay-2", amount: 4000, date: day(-25) }] },
  // Validée, échéance dans 20 jours.
  { id: "demo-inv-3", number: "F-0003", clientId: "demo-client-2", projectId: "demo-project-2", amount: 3000,
    issueDate: day(-5), dueDate: day(20), status: "ISSUED", payments: [] },
] as const;

const decided = { decidedBy: "demo-owner", decidedAt: day(-20) };
const expenses = [
  { id: "demo-exp-1", label: "Licence Figma annuelle", category: "SOFTWARE", amount: 450.5, date: day(-20),
    supplierId: "demo-supplier-1", projectId: null, status: "PAID", ...decided, paidBy: "demo-finance", paidAt: day(-20) },
  { id: "demo-exp-2", label: "Développement du tunnel de paiement", category: "FREELANCE", amount: 2500, date: day(10),
    supplierId: "demo-supplier-2", projectId: "demo-project-1", status: "APPROVED", ...decided },
  { id: "demo-exp-3", label: "Publicité Meta Ads", category: "ADVERTISING", amount: 1200, date: day(5),
    supplierId: null, projectId: "demo-project-2", status: "SUBMITTED" },
  { id: "demo-exp-4", label: "Second écran", category: "EQUIPMENT", amount: 900, date: day(-3),
    supplierId: null, projectId: null, status: "REJECTED", ...decided, rejectionReason: "Pas prioritaire ce trimestre" },
] as const;

async function main() {
  await prisma.company.upsert({ where: { id: COMPANY_ID }, update: {}, create: company });

  for (const partner of partners) {
    await prisma.client.upsert({ where: { id: partner.id }, update: {}, create: { ...partner, companyId: COMPANY_ID } });
  }

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  for (const user of users) {
    await prisma.user.upsert({ where: { id: user.id }, update: {}, create: { ...user, passwordHash, companyId: COMPANY_ID } });
  }

  for (const project of projects) {
    await prisma.project.upsert({ where: { id: project.id }, update: {}, create: { ...project, companyId: COMPANY_ID } });
  }

  for (const { payments, ...invoice } of invoices) {
    await prisma.invoice.upsert({
      where: { id: invoice.id },
      update: {},
      create: { ...invoice, companyId: COMPANY_ID, payments: { create: [...payments] } },
    });
  }

  for (const expense of expenses) {
    await prisma.expense.upsert({
      where: { id: expense.id },
      update: {},
      create: { ...expense, companyId: COMPANY_ID, submittedBy: "demo-member" },
    });
  }
}

main()
  .then(() => console.log("Données de démonstration créées."))
  .finally(() => prisma.$disconnect());
