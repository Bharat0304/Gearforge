/*
  Warnings:

  - You are about to drop the `Code` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Code";

-- CreateTable
CREATE TABLE "CodeSnippet" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CodeSnippet_pkey" PRIMARY KEY ("id")
);
