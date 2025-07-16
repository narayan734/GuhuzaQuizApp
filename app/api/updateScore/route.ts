import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { playerId, newlevel } = await req.json();

    if (!playerId || newlevel == null) {
      return NextResponse.json(
        { message: "All fields are required", playerId, newlevel },
        { status: 400 }
      );
    }

    // ✅ Step 1: Get current player first
    const currentPlayer = await prisma.player.findUnique({
      where: { Player_ID: playerId },
    });

    if (!currentPlayer) {
      return NextResponse.json(
        { message: "Player not found" },
        { status: 404 }
      );
    }

    // Step 2: Update only if new level is higher
    const updatedPlayer = await prisma.player.update({
      where: {
        Player_ID: playerId,
      },
      data: {
        Level_Id: {
          set: newlevel > (currentPlayer.Level_Id ?? 1)
            ? newlevel
            : currentPlayer.Level_Id,
        },
      },
    });

    return NextResponse.json(
      { message: "Player Level updated successfully", player: updatedPlayer },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Failed to update player level", error: e },
      { status: 500 }
    );
  }
}  