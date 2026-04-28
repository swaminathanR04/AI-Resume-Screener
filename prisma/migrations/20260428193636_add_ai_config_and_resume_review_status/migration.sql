-- CreateTable
CREATE TABLE "AI_Scoring_Config" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "skillsWeight" INTEGER NOT NULL DEFAULT 40,
    "experienceWeight" INTEGER NOT NULL DEFAULT 30,
    "educationWeight" INTEGER NOT NULL DEFAULT 20,
    "portfolioWeight" INTEGER NOT NULL DEFAULT 10,
    "customRules" TEXT NOT NULL DEFAULT '["Add a point if applicant is a US Veteran"]',
    "minimumScore" INTEGER NOT NULL DEFAULT 6,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Applicant_Job_Listings" (
    "applicantInfoId" INTEGER NOT NULL,
    "jobListingId" INTEGER NOT NULL,
    "appliedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewStatus" TEXT NOT NULL DEFAULT 'new',
    "aiScore" INTEGER,
    "aiSummary" TEXT,
    "aiMatchedSkills" TEXT,
    "aiMissingSkills" TEXT,
    "aiConcerns" TEXT,
    "aiScoredAt" DATETIME,
    "aiModel" TEXT,

    PRIMARY KEY ("applicantInfoId", "jobListingId"),
    CONSTRAINT "Applicant_Job_Listings_applicantInfoId_fkey" FOREIGN KEY ("applicantInfoId") REFERENCES "Applicant_Info" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Applicant_Job_Listings_jobListingId_fkey" FOREIGN KEY ("jobListingId") REFERENCES "Job_Listings" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Applicant_Job_Listings" ("aiConcerns", "aiMatchedSkills", "aiMissingSkills", "aiModel", "aiScore", "aiScoredAt", "aiSummary", "applicantInfoId", "appliedAt", "jobListingId") SELECT "aiConcerns", "aiMatchedSkills", "aiMissingSkills", "aiModel", "aiScore", "aiScoredAt", "aiSummary", "applicantInfoId", "appliedAt", "jobListingId" FROM "Applicant_Job_Listings";
DROP TABLE "Applicant_Job_Listings";
ALTER TABLE "new_Applicant_Job_Listings" RENAME TO "Applicant_Job_Listings";
CREATE INDEX "Applicant_Job_Listings_jobListingId_idx" ON "Applicant_Job_Listings"("jobListingId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
