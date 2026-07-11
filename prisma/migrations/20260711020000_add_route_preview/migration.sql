-- AlterTable: campo para T4.4 (route preview progress)
ALTER TABLE "User" ADD COLUMN "hasCompletedRouteAPreview" BOOLEAN NOT NULL DEFAULT false;
