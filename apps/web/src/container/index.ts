import {
  AddMember,
  ApproveExpense,
  GetDashboard,
  GetExpense,
  GetForecast,
  GetTreasury,
  GetReceipt,
  ListExpenses,
  PayExpense,
  RejectExpense,
  SubmitExpense,
  CancelInvoice,
  CreateClient,
  GetClient,
  CreateInvoice,
  CreateProject,
  ListProjectNames,
  ListProjects,
  ExportInvoicePdf,
  GetInvoice,
  ListClients,
  ListInvoices,
  ListMembers,
  Login,
  RecordPayment,
  ReversePayment,
  RegisterCompany,
  ValidateInvoice,
} from "@cashpilot/application";
import {
  BcryptPasswordHasher,
  PdfLibInvoiceRenderer,
  PrismaClientRepository,
  PrismaCompanyRepository,
  PrismaExpenseRepository,
  PrismaInvoiceRepository,
  PrismaProjectRepository,
  PrismaReceiptStorage,
  PrismaUserRepository,
  SystemClock,
  UuidGenerator,
} from "@cashpilot/infra";

// Composition root : le seul endroit qui choisit les implémentations concrètes.
const invoices = new PrismaInvoiceRepository();
const clients = new PrismaClientRepository();
const companies = new PrismaCompanyRepository();
const users = new PrismaUserRepository();
const expenses = new PrismaExpenseRepository();
const receipts = new PrismaReceiptStorage();
const projects = new PrismaProjectRepository();
const hasher = new BcryptPasswordHasher();
const clock = new SystemClock();
const ids = new UuidGenerator();
const getTreasury = new GetTreasury(companies, invoices, expenses);

export const useCases = {
  registerCompany: new RegisterCompany(companies, users, hasher, ids),
  login: new Login(users, hasher),
  addMember: new AddMember(users, hasher, ids),
  listMembers: new ListMembers(users),
  submitExpense: new SubmitExpense(expenses, receipts, ids, clients, projects),
  createProject: new CreateProject(projects, clients, ids),
  listProjects: new ListProjects(projects, invoices, expenses),
  listProjectNames: new ListProjectNames(projects),
  listExpenses: new ListExpenses(expenses, users),
  getExpense: new GetExpense(expenses, users),
  approveExpense: new ApproveExpense(expenses, clock),
  rejectExpense: new RejectExpense(expenses, clock),
  payExpense: new PayExpense(expenses),
  getReceipt: new GetReceipt(expenses, receipts),
  getTreasury,
  getDashboard: new GetDashboard(getTreasury, invoices, expenses, clock),
  getForecast: new GetForecast(getTreasury, invoices, expenses, clock),
  listClients: new ListClients(clients),
  createClient: new CreateClient(clients, ids),
  getClient: new GetClient(clients, invoices, expenses, users, clock),
  listInvoices: new ListInvoices(invoices, clock),
  getInvoice: new GetInvoice(invoices, clock),
  exportInvoicePdf: new ExportInvoicePdf(invoices, clients, companies, new PdfLibInvoiceRenderer(), clock),
  createInvoice: new CreateInvoice(invoices, clients, ids, projects),
  validateInvoice: new ValidateInvoice(invoices),
  cancelInvoice: new CancelInvoice(invoices),
  recordPayment: new RecordPayment(invoices, ids),
  reversePayment: new ReversePayment(invoices, ids, clock),
};
