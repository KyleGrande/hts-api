/*
  Warnings:

  - You are about to drop the column `userId` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `parkingSpotId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `requestId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `ParkingSpot` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userid` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Request` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `Request` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `matchId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentType` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('Available', 'Occupied', 'Reserved', 'Unavailable');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('Completed', 'Cancelled', 'Matched', 'Searching');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('Instant', 'Scheduled', 'Bid');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('Payment', 'Refund');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('CreditCard', 'PayPal', 'ApplePay', 'BankTransfer', 'AccountBalance');

-- DropForeignKey
ALTER TABLE "ParkingSpot" DROP CONSTRAINT "ParkingSpot_userid_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_parkingSpotId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_requestId_fkey";

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "userId",
ADD COLUMN     "location" geometry(Point, 4326) DEFAULT null,
ADD COLUMN     "userid" INTEGER NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "RequestStatus" NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "RequestType" NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "parkingSpotId",
DROP COLUMN "requestId",
DROP COLUMN "status",
ADD COLUMN     "matchId" INTEGER NOT NULL,
ADD COLUMN     "paymentType" "PaymentType" NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "TransactionType" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "ParkingSpot";

-- CreateTable
CREATE TABLE "Listing" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "status" "ListingStatus" NOT NULL,
    "availabilityStart" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "price" DECIMAL(10,2) NOT NULL,
    "region" TEXT,
    "subregion" TEXT,
    "location" geometry(Point, 4326) DEFAULT null,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "requestId" INTEGER NOT NULL,
    "listingId" INTEGER NOT NULL,
    "matchedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "location_idx" ON "Listing" USING GIST ("location");

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;
