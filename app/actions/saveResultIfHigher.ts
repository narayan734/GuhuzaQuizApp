'use server';

import prisma from "@/lib/prisma";

export async function saveResultIfHigher({
  playerId,
  levelId,
  correct,
  incorrect,
}: {
  playerId: number;
  levelId: number;
  correct: number;
  incorrect: number;
}) {
  console.log("✅ saveResultIfHigher called with:", {
    playerId,
    levelId,
    correct,
    incorrect,
  });

  const existingResult = await prisma.quizResult.findUnique({
    where: {
      playerId_levelId: {
        playerId,
        levelId,
      },
    },
  });

  console.log("📦 existingResult:", existingResult);

  if (!existingResult || correct > existingResult.correct) {
    console.log("💾 Saving or updating result...");
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
      },
      create: {
        playerId,
        levelId,
        correct,
        incorrect,
      },
    });

    return { updated: true };
  }

  console.log("🚫 No update: previous score is higher or same.");
  return { updated: false };
}
