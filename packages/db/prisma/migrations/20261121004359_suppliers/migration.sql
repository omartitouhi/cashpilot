-- CreateEnum
CREATE TYPE "PartnerKind" AS ENUM ('CLIENT', 'SUPPLIER');

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "kind" "PartnerKind" NOT NULL DEFAULT 'CLIENT';

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "supplierId" TEXT;
