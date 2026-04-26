-- CreateTable
CREATE TABLE "Applicant_Info" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "resumePath" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Applicant_Job_Listings" (
    "applicantInfoId" INTEGER NOT NULL,
    "jobListingId" INTEGER NOT NULL,
    "appliedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("applicantInfoId", "jobListingId"),
    CONSTRAINT "Applicant_Job_Listings_applicantInfoId_fkey" FOREIGN KEY ("applicantInfoId") REFERENCES "Applicant_Info" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Applicant_Job_Listings_jobListingId_fkey" FOREIGN KEY ("jobListingId") REFERENCES "Job_Listings" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Applicant_Job_Listings_jobListingId_idx" ON "Applicant_Job_Listings"("jobListingId");
