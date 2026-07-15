-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JoinRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requesterId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "rejectReason" TEXT,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "reviewedById" TEXT,
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "JoinRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JoinRequest_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JoinRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_JoinRequest" ("communityId", "createdAt", "id", "rejectReason", "requesterId", "reviewedAt", "reviewedById", "status", "updatedAt") SELECT "communityId", "createdAt", "id", "rejectReason", "requesterId", "reviewedAt", "reviewedById", "status", "updatedAt" FROM "JoinRequest";
DROP TABLE "JoinRequest";
ALTER TABLE "new_JoinRequest" RENAME TO "JoinRequest";
CREATE INDEX "JoinRequest_communityId_status_idx" ON "JoinRequest"("communityId", "status");
CREATE INDEX "JoinRequest_requesterId_status_idx" ON "JoinRequest"("requesterId", "status");
CREATE UNIQUE INDEX "JoinRequest_requesterId_communityId_key" ON "JoinRequest"("requesterId", "communityId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
