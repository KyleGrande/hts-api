-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('Matched', 'Completed', 'Cancelled', 'Searching');

-- CreateEnum
CREATE TYPE "public"."ListingStatus" AS ENUM ('Available', 'Occupied', 'Matched', 'Unavailable');

-- CreateEnum
CREATE TYPE "public"."RequestStatus" AS ENUM ('Completed', 'Cancelled', 'Matched', 'Searching');

-- CreateEnum
CREATE TYPE "public"."RequestType" AS ENUM ('Instant', 'Scheduled', 'Bid');

-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('Payment', 'Refund');

-- CreateEnum
CREATE TYPE "public"."PaymentType" AS ENUM ('CreditCard', 'PayPal', 'ApplePay', 'BankTransfer', 'AccountBalance');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "jwt" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "balance" MONEY NOT NULL DEFAULT 0.00,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Listing" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "status" "public"."Status" NOT NULL,
    "starttime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "price" DECIMAL(10,2) NOT NULL,
    "region" TEXT,
    "subregion" TEXT,
    "location" geometry,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Request" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "status" "public"."Status" NOT NULL,
    "type" "public"."RequestType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "starttime" TIMESTAMP(3) NOT NULL,
    "departuretime" TIMESTAMP(3) NOT NULL,
    "relist" BOOLEAN NOT NULL DEFAULT true,
    "location" geometry,
    "bid" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Match" (
    "id" SERIAL NOT NULL,
    "requestId" INTEGER NOT NULL,
    "listingId" INTEGER NOT NULL,
    "matchedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "distance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "paymentType" "public"."PaymentType" NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "buyerId" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_id_key" ON "public"."Listing"("id");

-- CreateIndex
CREATE INDEX "location_idx" ON "public"."Listing" USING GIST ("location");

-- CreateIndex
CREATE UNIQUE INDEX "Request_id_key" ON "public"."Request"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Match_id_key" ON "public"."Match"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Match_requestId_key" ON "public"."Match"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "Match_listingId_key" ON "public"."Match"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_id_key" ON "public"."Transaction"("id");

-- AddForeignKey
ALTER TABLE "public"."Listing" ADD CONSTRAINT "Listing_userid_fkey" FOREIGN KEY ("userid") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Request" ADD CONSTRAINT "Request_userid_fkey" FOREIGN KEY ("userid") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Match" ADD CONSTRAINT "Match_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Match" ADD CONSTRAINT "Match_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "public"."Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "public"."Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
