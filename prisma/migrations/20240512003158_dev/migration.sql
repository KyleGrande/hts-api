/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ParkingSpot` table. All the data in the column will be lost.
  - You are about to drop the column `departureTime` on the `ParkingSpot` table. All the data in the column will be lost.
  - Added the required column `departuretime` to the `ParkingSpot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ParkingSpot" DROP COLUMN "createdAt",
DROP COLUMN "departureTime",
ADD COLUMN     "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "departuretime" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "location" SET DEFAULT null;
