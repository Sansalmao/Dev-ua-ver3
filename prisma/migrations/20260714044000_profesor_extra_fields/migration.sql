-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "displayName" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "profileType" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "teacherVerificationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "hasCompletedRouteAPreview" BOOLEAN NOT NULL DEFAULT false,
    "country" TEXT,
    "institution" TEXT,
    "wantsCommunity" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "displayName", "email", "emailVerified", "hasCompletedRouteAPreview", "id", "image", "isAdmin", "profileType", "teacherVerificationStatus", "updatedAt") SELECT "createdAt", "displayName", "email", "emailVerified", "hasCompletedRouteAPreview", "id", "image", "isAdmin", "profileType", "teacherVerificationStatus", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_profileType_idx" ON "User"("profileType");
CREATE INDEX "User_teacherVerificationStatus_idx" ON "User"("teacherVerificationStatus");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
