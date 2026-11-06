// Ports
export type { ClientRepository } from "./ports/client-repository";
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

// Clients
export { ListClients, type ClientView } from "./client/list-clients";

// Factures
export { CreateInvoice, type CreateInvoiceInput } from "./invoice/create-invoice";
export { ValidateInvoice } from "./invoice/validate-invoice";
export { CancelInvoice } from "./invoice/cancel-invoice";
export { RecordPayment, type RecordPaymentInput } from "./invoice/record-payment";
export { ListInvoices } from "./invoice/list-invoices";
export { GetInvoice } from "./invoice/get-invoice";
export type { InvoiceView } from "./invoice/invoice-view";
