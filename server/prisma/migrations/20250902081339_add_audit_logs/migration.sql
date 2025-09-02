/*
  Warnings:

  - You are about to drop the column `message` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `AuditLog` table. All the data in the column will be lost.
  - Added the required column `action` to the `AuditLog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('PROFILE_VIEW', 'PROFILE_UPDATE', 'EMAIL_CHANGE_REQUEST', 'EMAIL_CHANGE_CONFIRM', 'PASSWORD_CHANGE', 'PASSWORD_RESET_REQUEST', 'PASSWORD_RESET_CONFIRM', 'LOGIN_SUCCESS', 'LOGIN_FAILURE', 'ACCOUNT_REGISTERED', 'EMAIL_VERIFICATION_SENT', 'EMAIL_VERIFIED');

-- CreateEnum
CREATE TYPE "ActorType" AS ENUM ('USER', 'SYSTEM', 'EXTERNAL');

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropIndex
DROP INDEX "AuditLog_userId_idx";

-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "message",
DROP COLUMN "type",
ADD COLUMN     "action" "AuditAction" NOT NULL,
ADD COLUMN     "actorId" INTEGER,
ADD COLUMN     "actorType" "ActorType" NOT NULL DEFAULT 'USER',
ADD COLUMN     "ip" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "requestId" TEXT,
ADD COLUMN     "targetId" TEXT,
ADD COLUMN     "targetType" TEXT,
ADD COLUMN     "userAgent" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_action_createdAt_idx" ON "AuditLog"("action", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_actorType_createdAt_idx" ON "AuditLog"("actorType", "createdAt");

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
