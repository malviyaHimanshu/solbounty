/*
  Warnings:

  - A unique constraint covering the columns `[issue_url]` on the table `Bounty` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Bounty" DROP CONSTRAINT "Bounty_won_by_id_fkey";

-- AlterTable
ALTER TABLE "Bounty" ALTER COLUMN "won_by_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Bounty_issue_url_key" ON "Bounty"("issue_url");

-- AddForeignKey
ALTER TABLE "Bounty" ADD CONSTRAINT "Bounty_won_by_id_fkey" FOREIGN KEY ("won_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
