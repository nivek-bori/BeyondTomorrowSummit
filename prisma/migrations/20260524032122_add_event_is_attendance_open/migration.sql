/*
  Warnings:

  - You are about to drop the column `teacherStateTime` on the `Event` table. All the data in the column will be lost.
  - Added the required column `isAttendanceOpen` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "teacherStateTime",
ADD COLUMN     "isAttendanceOpen" BOOLEAN NOT NULL;
