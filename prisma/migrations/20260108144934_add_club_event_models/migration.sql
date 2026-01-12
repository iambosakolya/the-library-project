-- CreateEnum
CREATE TYPE "ClubEventType" AS ENUM ('club', 'event');

-- CreateEnum
CREATE TYPE "ClubEventStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "ClubEventFormat" AS ENUM ('online', 'offline');

-- CreateTable
CREATE TABLE "ClubRequest" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "type" "ClubEventType" NOT NULL,
    "title" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(6) NOT NULL,
    "endDate" TIMESTAMP(6),
    "capacity" INTEGER NOT NULL,
    "format" "ClubEventFormat" NOT NULL,
    "address" TEXT,
    "onlineLink" TEXT,
    "sessionCount" INTEGER NOT NULL,
    "bookIds" TEXT[],
    "status" "ClubEventStatus" NOT NULL DEFAULT 'pending',
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadingClub" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "clubRequestId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(6) NOT NULL,
    "endDate" TIMESTAMP(6),
    "capacity" INTEGER NOT NULL,
    "format" "ClubEventFormat" NOT NULL,
    "address" TEXT,
    "onlineLink" TEXT,
    "sessionCount" INTEGER NOT NULL,
    "bookIds" TEXT[],
    "creatorId" UUID NOT NULL,
    "memberIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReadingClub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "eventRequestId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "eventDate" TIMESTAMP(6) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "format" "ClubEventFormat" NOT NULL,
    "address" TEXT,
    "onlineLink" TEXT,
    "bookIds" TEXT[],
    "organizerId" UUID NOT NULL,
    "attendeeIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReadingClub_clubRequestId_key" ON "ReadingClub"("clubRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_eventRequestId_key" ON "Event"("eventRequestId");

-- AddForeignKey
ALTER TABLE "ClubRequest" ADD CONSTRAINT "ClubRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingClub" ADD CONSTRAINT "ReadingClub_clubRequestId_fkey" FOREIGN KEY ("clubRequestId") REFERENCES "ClubRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingClub" ADD CONSTRAINT "ReadingClub_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_eventRequestId_fkey" FOREIGN KEY ("eventRequestId") REFERENCES "ClubRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
