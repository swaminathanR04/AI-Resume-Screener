/*
  Warnings:

  - Added the required column `userId` to the `Applicant_Info` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Applicant_Info" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "resumePath" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Applicant_Info_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Applicant_Info" ("createdAt", "id", "name", "resumePath", "updatedAt") SELECT "createdAt", "id", "name", "resumePath", "updatedAt" FROM "Applicant_Info";
DROP TABLE "Applicant_Info";
ALTER TABLE "new_Applicant_Info" RENAME TO "Applicant_Info";
CREATE UNIQUE INDEX "Applicant_Info_userId_key" ON "Applicant_Info"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
