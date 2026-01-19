-- DropIndex
DROP INDEX "Registration_userId_clubId_key";

-- DropIndex
DROP INDEX "Registration_userId_eventId_key";

-- CreateIndex
CREATE INDEX "Registration_userId_clubId_status_idx" ON "Registration"("userId", "clubId", "status");

-- CreateIndex
CREATE INDEX "Registration_userId_eventId_status_idx" ON "Registration"("userId", "eventId", "status");
