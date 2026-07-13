-- ============================================================================
-- Esquema completo UA Backend - para aplicar en una base Turso NUEVA y vacia.
-- Concatenacion de las migraciones de Prisma en orden cronologico.
-- Uso:  turso db shell <tu-base> < turso-schema.sql
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Migracion: 20260711014255_init
-- ---------------------------------------------------------------------------
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT,
    "profileType" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "teacherVerificationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Community" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "profileTrack" TEXT NOT NULL,
    "stage" TEXT NOT NULL DEFAULT 'CONCEPTOS_CLAVE',
    "graduated" BOOLEAN NOT NULL DEFAULT false,
    "graduatedAt" DATETIME,
    "teacherId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Community_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "JoinRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requesterId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "rejectReason" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "JoinRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JoinRequest_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JoinRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "requiredStage" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Challenge_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_profileType_idx" ON "User"("profileType");

-- CreateIndex
CREATE INDEX "User_teacherVerificationStatus_idx" ON "User"("teacherVerificationStatus");

-- CreateIndex
CREATE INDEX "Community_teacherId_idx" ON "Community"("teacherId");

-- CreateIndex
CREATE INDEX "Community_profileTrack_idx" ON "Community"("profileTrack");

-- CreateIndex
CREATE INDEX "Community_stage_idx" ON "Community"("stage");

-- CreateIndex
CREATE INDEX "JoinRequest_communityId_status_idx" ON "JoinRequest"("communityId", "status");

-- CreateIndex
CREATE INDEX "JoinRequest_requesterId_status_idx" ON "JoinRequest"("requesterId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "JoinRequest_requesterId_communityId_key" ON "JoinRequest"("requesterId", "communityId");

-- CreateIndex
CREATE INDEX "Challenge_communityId_requiredStage_idx" ON "Challenge"("communityId", "requiredStage");

-- ---------------------------------------------------------------------------
-- Migracion: 20260711020000_add_route_preview
-- ---------------------------------------------------------------------------
-- AlterTable: campo para T4.4 (route preview progress)
ALTER TABLE "User" ADD COLUMN "hasCompletedRouteAPreview" BOOLEAN NOT NULL DEFAULT false;

-- ---------------------------------------------------------------------------
-- Migracion: 20260711030000_add_submissions
-- ---------------------------------------------------------------------------
-- CreateTable
CREATE TABLE "Submission" (
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

-- CreateIndex
CREATE INDEX "Submission_challengeId_status_idx" ON "Submission"("challengeId", "status");

-- CreateIndex
CREATE INDEX "Submission_authorId_status_idx" ON "Submission"("authorId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_challengeId_authorId_key" ON "Submission"("challengeId", "authorId");

-- ---------------------------------------------------------------------------
-- Migracion: 20260713184024_better_auth_migration
-- ---------------------------------------------------------------------------
/*
  Warnings:

  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" DATETIME,
    "refreshTokenExpiresAt" DATETIME,
    "scope" TEXT,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);

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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "displayName", "email", "hasCompletedRouteAPreview", "id", "isAdmin", "profileType", "teacherVerificationStatus", "updatedAt") SELECT "createdAt", "displayName", "email", "hasCompletedRouteAPreview", "id", "isAdmin", "profileType", "teacherVerificationStatus", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_profileType_idx" ON "User"("profileType");
CREATE INDEX "User_teacherVerificationStatus_idx" ON "User"("teacherVerificationStatus");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "Verification_identifier_idx" ON "Verification"("identifier");
