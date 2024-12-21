-- AlterEnum
ALTER TYPE "EngagementType" ADD VALUE 'BOOKMARK';

-- DropForeignKey
ALTER TABLE "Engagement" DROP CONSTRAINT "Engagement_commentId_fkey";

-- AlterTable
ALTER TABLE "Engagement" ALTER COLUMN "commentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
