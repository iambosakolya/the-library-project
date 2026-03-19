-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('present', 'absent', 'excused');

-- AlterTable
ALTER TABLE "BookSubmission" ADD COLUMN     "isForSale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "suggestedPrice" DECIMAL(12,2);

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "changeHistory" JSON[] DEFAULT ARRAY[]::JSON[];

-- AlterTable
ALTER TABLE "ReadingClub" ADD COLUMN     "changeHistory" JSON[] DEFAULT ARRAY[]::JSON[];

-- CreateTable
CREATE TABLE "Attendance" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "clubId" UUID,
    "eventId" UUID,
    "sessionNumber" INTEGER NOT NULL DEFAULT 1,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'present',
    "notes" TEXT,
    "markedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Attendance_clubId_idx" ON "Attendance"("clubId");

-- CreateIndex
CREATE INDEX "Attendance_eventId_idx" ON "Attendance"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_userId_clubId_sessionNumber_key" ON "Attendance"("userId", "clubId", "sessionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_userId_eventId_sessionNumber_key" ON "Attendance"("userId", "eventId", "sessionNumber");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "ReadingClub"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
