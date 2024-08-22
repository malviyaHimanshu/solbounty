/*
  Warnings:

  - Changed the type of `status` on the `Attempt` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Attempt" DROP COLUMN "status",
ADD COLUMN     "status" "AttemptStatus" NOT NULL;

-- DropEnum
DROP TYPE "Status";
