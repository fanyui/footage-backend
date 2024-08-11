-- AlterTable
ALTER TABLE "Alert" ALTER COLUMN "resolved" SET DEFAULT false;

-- AlterTable
ALTER TABLE "DetectedEvent" ALTER COLUMN "event_start_time" SET DATA TYPE TEXT,
ALTER COLUMN "event_end_time" SET DATA TYPE TEXT,
ALTER COLUMN "severity" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Suspect" ADD COLUMN     "first_cited" TEXT,
ALTER COLUMN "confidence" DROP NOT NULL,
ALTER COLUMN "associated_items" DROP NOT NULL,
ALTER COLUMN "images" DROP NOT NULL;
