-- CreateEnum
CREATE TYPE "HouseType" AS ENUM ('APARTMENT', 'HOUSE', 'LAND', 'COMMERCIAL');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('RENT', 'SALE', 'SHORTLET');

-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "ROLE" NOT NULL DEFAULT 'USER',
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "datesBooked" TIMESTAMP(3)[],
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "locationId" TEXT NOT NULL,
    "cautionFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "agencyFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "legalFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "houseType" "HouseType" NOT NULL,
    "category" "Category" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_propertyId_startDate_key" ON "bookings"("propertyId", "startDate");

-- CreateIndex
CREATE INDEX "properties_datesBooked_isBooked_locationId_houseType_catego_idx" ON "properties"("datesBooked", "isBooked", "locationId", "houseType", "category", "userId");

-- CreateIndex
CREATE INDEX "locations_address_city_state_idx" ON "locations"("address", "city", "state");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
