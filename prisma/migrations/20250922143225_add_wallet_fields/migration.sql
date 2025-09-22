/*
  Warnings:

  - Added the required column `updatedAt` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."WalletType" AS ENUM ('CHECKING_ACCOUNT', 'SAVINGS_ACCOUNT', 'CASH', 'INVESTMENT', 'CREDIT_CARD', 'OTHER');

-- AlterTable
ALTER TABLE "public"."Wallet" ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#4CAF50',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "icon" TEXT NOT NULL DEFAULT 'wallet',
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "type" "public"."WalletType" NOT NULL DEFAULT 'CHECKING_ACCOUNT',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "initialBalance" SET DEFAULT 0,
ALTER COLUMN "currentBalance" SET DEFAULT 0;
