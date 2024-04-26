-- AlterTable
ALTER TABLE "properties" ALTER COLUMN "datesBooked" SET DEFAULT ARRAY[]::TIMESTAMP(3)[];
