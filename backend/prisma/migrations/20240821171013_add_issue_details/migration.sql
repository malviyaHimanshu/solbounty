/*
  Warnings:

  - Added the required column `issue_number` to the `Bounty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issue_owner` to the `Bounty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issue_repo` to the `Bounty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bounty" ADD COLUMN     "issue_number" INTEGER NOT NULL,
ADD COLUMN     "issue_owner" TEXT NOT NULL,
ADD COLUMN     "issue_repo" TEXT NOT NULL;
