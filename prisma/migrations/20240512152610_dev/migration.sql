/*
  Warnings:

  - The `balance` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ParkingSpot" ALTER COLUMN "location" SET DEFAULT null;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "balance",
ADD COLUMN     "balance" MONEY NOT NULL DEFAULT 0.00;
