-- CreateEnum
CREATE TYPE "Tables" AS ENUM ('USER', 'EVENT', 'EVENTTABLE');

-- AlterEnum
ALTER TYPE "EventStatus" ADD VALUE 'DELETED';

-- CreateTable
CREATE TABLE "ChangeHistory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "instigatorId" TEXT NOT NULL,
    "affectedTable" "Tables" NOT NULL,
    "payload" JSONB NOT NULL,

    CONSTRAINT "ChangeHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChangeHistory" ADD CONSTRAINT "ChangeHistory_instigatorId_fkey" FOREIGN KEY ("instigatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
