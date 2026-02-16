/*
  Warnings:

  - The values [DELETED] on the enum `EventStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [BANNED] on the enum `UserStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `ChangeHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ActivityTarget" AS ENUM ('USER', 'EVENT', 'SCHEDULE');

-- AlterEnum
BEGIN;
CREATE TYPE "EventStatus_new" AS ENUM ('ACTIVE', 'HIDDEN');
ALTER TABLE "public"."Event" ALTER COLUMN "visibility" DROP DEFAULT;
ALTER TABLE "Event" ALTER COLUMN "visibility" TYPE "EventStatus_new" USING ("visibility"::text::"EventStatus_new");
ALTER TYPE "EventStatus" RENAME TO "EventStatus_old";
ALTER TYPE "EventStatus_new" RENAME TO "EventStatus";
DROP TYPE "public"."EventStatus_old";
ALTER TABLE "Event" ALTER COLUMN "visibility" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserStatus_new" AS ENUM ('ACTIVE', 'SUSPENDED');
ALTER TABLE "public"."User" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "status" TYPE "UserStatus_new" USING ("status"::text::"UserStatus_new");
ALTER TYPE "UserStatus" RENAME TO "UserStatus_old";
ALTER TYPE "UserStatus_new" RENAME TO "UserStatus";
DROP TYPE "public"."UserStatus_old";
ALTER TABLE "User" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- DropForeignKey
ALTER TABLE "ChangeHistory" DROP CONSTRAINT "ChangeHistory_instigatorId_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "modNote" VARCHAR(200);

-- AlterTable
ALTER TABLE "Timetable" ADD COLUMN     "unlisted" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "ChangeHistory";

-- DropEnum
DROP TYPE "Tables";

-- CreateTable
CREATE TABLE "ActivityHistory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "instigatorId" TEXT NOT NULL,
    "affects" "ActivityTarget" NOT NULL,
    "affectedId" TEXT,
    "payload" JSONB NOT NULL,

    CONSTRAINT "ActivityHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ActivityHistory" ADD CONSTRAINT "ActivityHistory_instigatorId_fkey" FOREIGN KEY ("instigatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
