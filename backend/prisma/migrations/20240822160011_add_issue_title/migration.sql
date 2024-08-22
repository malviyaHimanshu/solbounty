/*
  Warnings:

  - Added the required column `issue_title` to the `Bounty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bounty" ADD COLUMN     "issue_title" TEXT NOT NULL;
