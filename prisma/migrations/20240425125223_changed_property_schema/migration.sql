/*
  Warnings:

  - You are about to drop the column `houseType` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `properties` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "properties_houseType_idx";

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "houseType",
DROP COLUMN "images",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "imageUrls" TEXT[],
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropEnum
DROP TYPE "HouseType";
