/*
  Warnings:

  - You are about to alter the column `channel` on the `Timetable` table. The data in that column could be lost. The data in that column will be cast from `VarChar(32)` to `VarChar(25)`.

*/
-- AlterTable
ALTER TABLE "Timetable" ALTER COLUMN "channel" SET DATA TYPE VARCHAR(25);
