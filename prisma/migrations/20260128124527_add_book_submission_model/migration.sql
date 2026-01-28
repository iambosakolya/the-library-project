-- CreateEnum
CREATE TYPE "BookSubmissionStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "BookSubmission" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "isbn" TEXT,
    "isbn13" TEXT,
    "publisher" TEXT,
    "publishedDate" TEXT,
    "description" TEXT NOT NULL,
    "pageCount" INTEGER,
    "language" TEXT,
    "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "coverImage" TEXT,
    "thumbnailImage" TEXT,
    "previewLink" TEXT,
    "googleBooksId" TEXT,
    "status" "BookSubmissionStatus" NOT NULL DEFAULT 'pending',
    "rejectionReason" TEXT,
    "adminNotes" TEXT,
    "productId" UUID,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookSubmission_userId_idx" ON "BookSubmission"("userId");

-- CreateIndex
CREATE INDEX "BookSubmission_status_idx" ON "BookSubmission"("status");

-- CreateIndex
CREATE INDEX "BookSubmission_isbn_idx" ON "BookSubmission"("isbn");

-- CreateIndex
CREATE INDEX "BookSubmission_isbn13_idx" ON "BookSubmission"("isbn13");

-- AddForeignKey
ALTER TABLE "BookSubmission" ADD CONSTRAINT "BookSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
