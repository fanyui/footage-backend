-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'AGENT', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "last_login" TIMESTAMP(3),
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" TEXT NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "detectedEventId" TEXT NOT NULL,
    "generated_at" TIMESTAMP(3) NOT NULL,
    "alert_type" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Suspect" (
    "id" TEXT NOT NULL,
    "detectedEventId" TEXT NOT NULL,
    "appearance" TEXT NOT NULL,
    "behavior" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "associated_items" TEXT NOT NULL,
    "images" TEXT NOT NULL,

    CONSTRAINT "Suspect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetectedEvent" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "event_start_time" TIMESTAMP(3) NOT NULL,
    "event_end_time" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "severity" INTEGER NOT NULL,
    "detected_by" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "DetectedEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "uploaded_by" TEXT NOT NULL,
    "upload_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source_location" TEXT,
    "video_path" TEXT NOT NULL,
    "duration" INTEGER,
    "status" TEXT,
    "resolution" TEXT,
    "gemini_create_time" TIMESTAMP(3),
    "gemini_update_time" TIMESTAMP(3),
    "gemini_expiration_time" TIMESTAMP(3),
    "mime_type" TEXT,
    "gemini_state" TEXT,
    "gemini_uri" TEXT,
    "gemini_display_name" TEXT,
    "gemini_size_bytes" INTEGER,
    "gemini_name" TEXT,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_detectedEventId_fkey" FOREIGN KEY ("detectedEventId") REFERENCES "DetectedEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suspect" ADD CONSTRAINT "Suspect_detectedEventId_fkey" FOREIGN KEY ("detectedEventId") REFERENCES "DetectedEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetectedEvent" ADD CONSTRAINT "DetectedEvent_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
