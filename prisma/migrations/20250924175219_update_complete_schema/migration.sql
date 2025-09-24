/*
  Warnings:

  - You are about to drop the column `biometricEnabled` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `notificationSettings` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pinCode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `themePreference` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `BankConnection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Budget` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CreditCardBill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Installment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentMethod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WalletGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."BankConnection" DROP CONSTRAINT "BankConnection_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Budget" DROP CONSTRAINT "Budget_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Budget" DROP CONSTRAINT "Budget_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Category" DROP CONSTRAINT "Category_parentCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Category" DROP CONSTRAINT "Category_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CreditCardBill" DROP CONSTRAINT "CreditCardBill_paymentMethodId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Installment" DROP CONSTRAINT "Installment_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Installment" DROP CONSTRAINT "Installment_paymentMethodId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Installment" DROP CONSTRAINT "Installment_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PaymentMethod" DROP CONSTRAINT "PaymentMethod_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PaymentMethod" DROP CONSTRAINT "PaymentMethod_walletGroupId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_creditCardBillId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_installmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_paymentMethodId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserSettings" DROP CONSTRAINT "UserSettings_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WalletGroup" DROP CONSTRAINT "WalletGroup_userId_fkey";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "biometricEnabled",
DROP COLUMN "notificationSettings",
DROP COLUMN "pinCode",
DROP COLUMN "themePreference";

-- DropTable
DROP TABLE "public"."BankConnection";

-- DropTable
DROP TABLE "public"."Budget";

-- DropTable
DROP TABLE "public"."Category";

-- DropTable
DROP TABLE "public"."CreditCardBill";

-- DropTable
DROP TABLE "public"."Installment";

-- DropTable
DROP TABLE "public"."Notification";

-- DropTable
DROP TABLE "public"."PaymentMethod";

-- DropTable
DROP TABLE "public"."Transaction";

-- DropTable
DROP TABLE "public"."UserSettings";

-- DropTable
DROP TABLE "public"."WalletGroup";

-- DropEnum
DROP TYPE "public"."BillStatus";

-- DropEnum
DROP TYPE "public"."CategoryType";

-- DropEnum
DROP TYPE "public"."InstallmentType";

-- DropEnum
DROP TYPE "public"."PaymentMethodType";

-- DropEnum
DROP TYPE "public"."ThemePreference";

-- DropEnum
DROP TYPE "public"."TransactionType";

-- DropEnum
DROP TYPE "public"."WalletGroupType";
