/*
  Warnings:

  - You are about to drop the column `userId` on the `ParkingSpot` table. All the data in the column will be lost.
  - Added the required column `userid` to the `ParkingSpot` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ParkingSpot" DROP CONSTRAINT "ParkingSpot_userId_fkey";

-- AlterTable
ALTER TABLE "ParkingSpot" DROP COLUMN "userId",
ADD COLUMN     "userid" INTEGER NOT NULL,
ALTER COLUMN "location" SET DEFAULT null;

-- AddForeignKey
ALTER TABLE "ParkingSpot" ADD CONSTRAINT "ParkingSpot_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
