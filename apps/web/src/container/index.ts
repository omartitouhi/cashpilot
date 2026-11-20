import {
  CancelInvoice,
  CreateInvoice,
  ListClients,
  ListInvoices,
  RecordPayment,
  ValidateInvoice,
} from "@cashpilot/application";
import {
  PrismaClientRepository,
  PrismaInvoiceRepository,
  SystemClock,
  UuidGenerator,
} from "@cashpilot/infra";

// Composition root : le seul endroit qui choisit les implémentations concrètes.
const invoices = new PrismaInvoiceRepository();
const clients = new PrismaClientRepository();
const clock = new SystemClock();
const ids = new UuidGenerator();

export const useCases = {
  listClients: new ListClients(clients),
  listInvoices: new ListInvoices(invoices, clock),
  createInvoice: new CreateInvoice(invoices, clients, ids),
  validateInvoice: new ValidateInvoice(invoices),
  cancelInvoice: new CancelInvoice(invoices),
  recordPayment: new RecordPayment(invoices, ids),
};
