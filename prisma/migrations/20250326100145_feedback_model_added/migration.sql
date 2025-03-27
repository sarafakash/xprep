-- CreateTable
CREATE TABLE "Feedback" (
    "id" SERIAL NOT NULL,
    "interviewId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "totalScore" INTEGER NOT NULL,
    "strengths" TEXT[],
    "areasForImprovement" TEXT[],
    "finalAssessment" TEXT NOT NULL,
    "categoryScores" JSONB NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);
