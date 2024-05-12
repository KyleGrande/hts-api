/*
  Warnings:

  - You are about to drop the column `availabilityStart` on the `Listing` table. All the data in the column will be lost.
  - Added the required column `availabilitystart` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "availabilityStart",
ADD COLUMN     "availabilitystart" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "location" SET DEFAULT null;

-- AlterTable
ALTER TABLE "Request" ALTER COLUMN "location" SET DEFAULT null;
