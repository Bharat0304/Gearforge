/*
  Warnings:

  - You are about to drop the `CodeSnippet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Jobs` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'FAILED';

-- DropForeignKey
ALTER TABLE "Generation" DROP CONSTRAINT "Generation_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Jobs" DROP CONSTRAINT "Jobs_generationId_fkey";

-- AlterTable
ALTER TABLE "Generation" ADD COLUMN     "error" TEXT,
ADD COLUMN     "generatedCode" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "videoUrl" TEXT,
ALTER COLUMN "projectId" DROP NOT NULL;

-- DropTable
DROP TABLE "CodeSnippet";

-- DropTable
DROP TABLE "Jobs";

-- AddForeignKey
ALTER TABLE "Generation" ADD CONSTRAINT "Generation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
