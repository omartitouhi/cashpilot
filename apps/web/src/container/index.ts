import {
  AddMember,
  CancelInvoice,
  CreateInvoice,
  GetInvoice,
  ListClients,
  ListInvoices,
  ListMembers,
  Login,
  RecordPayment,
  RegisterCompany,
  ValidateInvoice,
} from "@cashpilot/application";
import {
  BcryptPasswordHasher,
  PrismaClientRepository,
  PrismaCompanyRepository,
  PrismaInvoiceRepository,
  PrismaUserRepository,
  SystemClock,
  UuidGenerator,
} from "@cashpilot/infra";

// Composition root : le seul endroit qui choisit les implémentations concrètes.
const invoices = new PrismaInvoiceRepository();
const clients = new PrismaClientRepository();
const companies = new PrismaCompanyRepository();
const users = new PrismaUserRepository();
const hasher = new BcryptPasswordHasher();
const clock = new SystemClock();
const ids = new UuidGenerator();

export const useCases = {
  registerCompany: new RegisterCompany(companies, users, hasher, ids),
  login: new Login(users, hasher),
  addMember: new AddMember(users, hasher, ids),
  listMembers: new ListMembers(users),
  listClients: new ListClients(clients),
  listInvoices: new ListInvoices(invoices, clock),
  getInvoice: new GetInvoice(invoices, clock),
  createInvoice: new CreateInvoice(invoices, clients, ids),
  validateInvoice: new ValidateInvoice(invoices),
  cancelInvoice: new CancelInvoice(invoices),
  recordPayment: new RecordPayment(invoices, ids),
};
