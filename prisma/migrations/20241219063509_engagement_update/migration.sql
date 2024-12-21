-- DropForeignKey
ALTER TABLE "Engagement" DROP CONSTRAINT "Engagement_postId_fkey";

-- AlterTable
ALTER TABLE "Engagement" ALTER COLUMN "postId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
