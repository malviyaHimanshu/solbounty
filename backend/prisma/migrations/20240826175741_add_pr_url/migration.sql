/*
  Warnings:

  - Added the required column `pr_url` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "pr_url" TEXT NOT NULL;
