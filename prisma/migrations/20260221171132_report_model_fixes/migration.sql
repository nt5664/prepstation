-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_handlerId_fkey";

-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "handlerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_handlerId_fkey" FOREIGN KEY ("handlerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
