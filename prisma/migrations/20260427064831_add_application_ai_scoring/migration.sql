-- AlterTable
ALTER TABLE "Applicant_Job_Listings" ADD COLUMN "aiConcerns" TEXT;
ALTER TABLE "Applicant_Job_Listings" ADD COLUMN "aiMatchedSkills" TEXT;
ALTER TABLE "Applicant_Job_Listings" ADD COLUMN "aiMissingSkills" TEXT;
ALTER TABLE "Applicant_Job_Listings" ADD COLUMN "aiModel" TEXT;
ALTER TABLE "Applicant_Job_Listings" ADD COLUMN "aiScore" INTEGER;
ALTER TABLE "Applicant_Job_Listings" ADD COLUMN "aiScoredAt" DATETIME;
ALTER TABLE "Applicant_Job_Listings" ADD COLUMN "aiSummary" TEXT;
