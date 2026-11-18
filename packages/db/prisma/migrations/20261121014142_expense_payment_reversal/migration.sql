-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "reversalReason" TEXT,
ADD COLUMN     "reversedAt" TIMESTAMP(3),
ADD COLUMN     "reversedBy" TEXT,
ADD COLUMN     "reversedPaidAt" DATE,
ADD COLUMN     "reversedPaidBy" TEXT;
