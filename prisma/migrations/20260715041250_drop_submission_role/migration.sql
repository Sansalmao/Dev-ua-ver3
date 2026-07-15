/*
  Warnings:

  - You are about to drop the column `role` on the `Submission` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "challengeId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "repoUrl" TEXT NOT NULL,
    "language" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "rating" REAL,
    "rejectReason" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Submission_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Submission_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Submission_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Submission" ("authorId", "challengeId", "createdAt", "id", "language", "rating", "rejectReason", "repoUrl", "reviewedAt", "reviewedById", "status", "updatedAt") SELECT "authorId", "challengeId", "createdAt", "id", "language", "rating", "rejectReason", "repoUrl", "reviewedAt", "reviewedById", "status", "updatedAt" FROM "Submission";
DROP TABLE "Submission";
ALTER TABLE "new_Submission" RENAME TO "Submission";
CREATE INDEX "Submission_challengeId_status_idx" ON "Submission"("challengeId", "status");
CREATE INDEX "Submission_authorId_status_idx" ON "Submission"("authorId", "status");
CREATE UNIQUE INDEX "Submission_challengeId_authorId_key" ON "Submission"("challengeId", "authorId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
