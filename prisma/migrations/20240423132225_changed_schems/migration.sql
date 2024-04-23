/*
  Warnings:

  - The `details` column on the `properties` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "properties_datesBooked_isBooked_locationId_houseType_catego_idx";

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "images" TEXT[],
DROP COLUMN "details",
ADD COLUMN     "details" TEXT[];

-- CreateIndex
CREATE INDEX "properties_locationId_idx" ON "properties"("locationId");

-- CreateIndex
CREATE INDEX "properties_userId_idx" ON "properties"("userId");

-- CreateIndex
CREATE INDEX "properties_houseType_idx" ON "properties"("houseType");

-- CreateIndex
CREATE INDEX "properties_category_idx" ON "properties"("category");
