// Ports
export type { ClientRepository } from "./ports/client-repository";
export type { ExpenseRepository } from "./ports/expense-repository";
export type { ReceiptFile, ReceiptStorage } from "./ports/receipt-storage";
export type { Clock } from "./ports/clock";
export type { CompanyRepository } from "./ports/company-repository";
export type { PasswordHasher } from "./ports/password-hasher";
export type { UserRepository } from "./ports/user-repository";
export type { IdGenerator } from "./ports/id-generator";
export type { InvoiceRepository } from "./ports/invoice-repository";

// Erreurs
export { NotFoundError } from "./shared/not-found-error";
export { isBusinessError } from "./shared/business-error";
export { ForbiddenError } from "./shared/forbidden-error";

// Utilisateur connecté et permissions
export { assertCan, type Actor } from "./shared/actor";
export { can, ROLE_LABELS, type Permission, type Role } from "@cashpilot/domain";

// Accès et équipe
export { RegisterCompany, type RegisterCompanyInput } from "./auth/register-company";
export { Login, type LoginInput } from "./auth/login";
export type { SessionUser } from "./auth/session-user";
export { AddMember, type AddMemberInput } from "./team/add-member";
export { ListMembers, type MemberView } from "./team/list-members";

// Dépenses
export { SubmitExpense, type SubmitExpenseInput } from "./expense/submit-expense";
export { ListExpenses } from "./expense/list-expenses";
export { GetExpense } from "./expense/get-expense";
export { ApproveExpense } from "./expense/approve-expense";
export { RejectExpense } from "./expense/reject-expense";
export { PayExpense, type PayExpenseInput } from "./expense/pay-expense";
export { GetReceipt } from "./expense/get-receipt";
export type { ExpenseView } from "./expense/expense-view";
export { RECEIPT_MAX_BYTES, RECEIPT_TYPES } from "./expense/receipt-rules";
export { EXPENSE_CATEGORIES, type ExpenseCategory, type ExpenseStatus } from "@cashpilot/domain";

// Trésorerie et tableau de bord
export { GetTreasury, type TreasuryView } from "./treasury/get-treasury";
export { GetDashboard, type DashboardView } from "./treasury/get-dashboard";

// Prévisions et simulation
export { GetForecast, type ForecastView, type ScenarioInput } from "./forecast/get-forecast";

// Clients
export { ListClients, type ClientView } from "./client/list-clients";
export { CreateClient, type CreateClientInput } from "./client/create-client";
export { GetClient, type ClientDetailView } from "./client/get-client";

// Factures
export { CreateInvoice, type CreateInvoiceInput } from "./invoice/create-invoice";
export { ValidateInvoice } from "./invoice/validate-invoice";
export { CancelInvoice } from "./invoice/cancel-invoice";
export { RecordPayment, type RecordPaymentInput } from "./invoice/record-payment";
export { ListInvoices } from "./invoice/list-invoices";
export { GetInvoice } from "./invoice/get-invoice";
export type { InvoiceView } from "./invoice/invoice-view";
