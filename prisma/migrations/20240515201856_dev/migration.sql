/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Listing` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Match` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[requestId]` on the table `Match` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[listingId]` on the table `Match` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Request` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Listing" ALTER COLUMN "location" SET DEFAULT null;

-- AlterTable
ALTER TABLE "Request" ALTER COLUMN "location" SET DEFAULT null;

-- CreateIndex
CREATE UNIQUE INDEX "Listing_id_key" ON "Listing"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Match_id_key" ON "Match"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Match_requestId_key" ON "Match"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "Match_listingId_key" ON "Match"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "Request_id_key" ON "Request"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_id_key" ON "Transaction"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
