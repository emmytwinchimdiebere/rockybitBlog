/*
  Warnings:

  - Added the required column `commentId` to the `Engagement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Engagement" ADD COLUMN     "commentId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
