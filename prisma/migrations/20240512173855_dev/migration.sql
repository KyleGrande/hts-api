/*
  Warnings:

  - You are about to drop the column `arrivalTime` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `departureTime` on the `Request` table. All the data in the column will be lost.
  - Added the required column `arrivaltime` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departuretime` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Listing" ALTER COLUMN "location" SET DEFAULT null;

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "arrivalTime",
DROP COLUMN "departureTime",
ADD COLUMN     "arrivaltime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "departuretime" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "location" SET DEFAULT null;
