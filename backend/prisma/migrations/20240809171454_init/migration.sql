-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "github_username" TEXT NOT NULL,
    "account_addr" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bounty" (
    "id" SERIAL NOT NULL,
    "issue_url" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "created_by_id" INTEGER NOT NULL,
    "won_by_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bounty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_github_username_key" ON "User"("github_username");

-- CreateIndex
CREATE UNIQUE INDEX "User_account_addr_key" ON "User"("account_addr");

-- AddForeignKey
ALTER TABLE "Bounty" ADD CONSTRAINT "Bounty_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bounty" ADD CONSTRAINT "Bounty_won_by_id_fkey" FOREIGN KEY ("won_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
