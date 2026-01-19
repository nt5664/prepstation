/*
  Warnings:

  - Added the required column `channel` to the `Timetable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `website` to the `Timetable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Timetable" ADD COLUMN     "channel" VARCHAR(32) NOT NULL,
ADD COLUMN     "website" VARCHAR(64) NOT NULL;
