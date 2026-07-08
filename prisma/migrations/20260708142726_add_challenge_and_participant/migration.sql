-- CreateTable
CREATE TABLE "challenge" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenge_participant" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenge_participant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "challenge_authorId_idx" ON "challenge"("authorId");

-- CreateIndex
CREATE INDEX "challenge_participant_userId_idx" ON "challenge_participant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "challenge_participant_challengeId_userId_key" ON "challenge_participant"("challengeId", "userId");

-- AddForeignKey
ALTER TABLE "challenge" ADD CONSTRAINT "challenge_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_participant" ADD CONSTRAINT "challenge_participant_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_participant" ADD CONSTRAINT "challenge_participant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
