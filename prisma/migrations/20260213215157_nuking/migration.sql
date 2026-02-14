/*
  Warnings:

  - You are about to drop the column `serviceCategoryId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `detectedServiceId` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the `CrudUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "BookingServiceType" AS ENUM ('PLUMBING', 'ELECTRICAL', 'CLEANING', 'CARPENTRY', 'OTHER');

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_serviceCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_detectedServiceId_fkey";

-- DropIndex
DROP INDEX "Booking_serviceCategoryId_idx";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "serviceCategoryId",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "serviceType" "BookingServiceType",
ALTER COLUMN "address" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "detectedServiceId";

-- DropTable
DROP TABLE "CrudUser";

-- DropTable
DROP TABLE "ServiceCategory";
