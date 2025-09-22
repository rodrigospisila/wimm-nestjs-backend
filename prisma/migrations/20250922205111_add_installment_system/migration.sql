/*
  Warnings:

  - Added the required column `updatedAt` to the `Installment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."InstallmentType" AS ENUM ('FIXED', 'CREDIT_CARD');

-- DropForeignKey
ALTER TABLE "public"."Installment" DROP CONSTRAINT "Installment_creditCardId_fkey";

-- AlterTable
ALTER TABLE "public"."Installment" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "installmentType" "public"."InstallmentType" NOT NULL DEFAULT 'FIXED',
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "tags" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "currentInstallment" SET DEFAULT 0,
ALTER COLUMN "creditCardId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Installment" ADD CONSTRAINT "Installment_creditCardId_fkey" FOREIGN KEY ("creditCardId") REFERENCES "public"."CreditCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
