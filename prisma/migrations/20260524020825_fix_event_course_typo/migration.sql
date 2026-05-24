/*
  Warnings:

  - You are about to drop the column `CourseId` on the `Event` table. All the data in the column will be lost.
  - Added the required column `courseId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_CourseId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "CourseId",
ADD COLUMN     "courseId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
