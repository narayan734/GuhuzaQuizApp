'use server';

import prisma from "@/lib/prisma";

export async function fetchResultsByPlayer(playerId: number) {
  const results = await prisma.quizResult.findMany({
    where: { playerId },
  });
  return results;
}

export async function saveResultIfHigher({
  playerId,
  levelId,
  correct,
  incorrect,
  score
}: {
  playerId: number;
  levelId: number;
  correct: number;
  incorrect: number;
  score: number;
}) {
  const existingResult = await prisma.quizResult.findUnique({
    where: {
      playerId_levelId: {
        playerId,
        levelId,
      },
    },
  });

  const previousScore = existingResult?.score ?? 0;
  const newScore = correct * 10; // ✅ replace this logic if you use retry/hint penalties
  const scoreDifference = newScore - previousScore;

  if (!existingResult || newScore > previousScore) {
    // 1. Save or update the quiz result
    await prisma.quizResult.upsert({
      where: {
        playerId_levelId: {
          playerId,
          levelId,
        },
      },
      update: {
        correct,
        incorrect,
        score: newScore, // ✅ now saving actual score
      },
      create: {
        playerId,
        levelId,
        correct,
        incorrect,
        score: newScore,
      },
    });

    // 2. Update Player's total score using the score delta
    await prisma.player.update({
      where: { Player_ID: playerId },
      data: {
        Playerpoint: {
          increment: scoreDifference,
        },
      },
    });

    return { updated: true };
  }

  return { updated: false };
}
