import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const playerId = Number(body.playerId);
    const levelId = Number(body.levelId);
    const correct = Number(body.correct);
    const total = Number(body.total);
    const incorrect = total - correct;

    console.log("saveResult request:", { playerId, levelId, correct, total });

    const saveResult = await prisma.quizResult.upsert({
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

    return NextResponse.json({ message: "Saved", saveResult }, { status: 200 });
  } catch (e) {
    console.error("Error saving result:", e);
    return NextResponse.json({ error: "Failed to save result", e }, { status: 500 });
  }
}
