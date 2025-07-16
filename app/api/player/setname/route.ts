import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { playerId, newName } = await req.json();

    if (!playerId || !newName || typeof newName !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid input" },
        { status: 400 }
      );
    }

    const updatedPlayer = await prisma.player.update({
      where: { Player_ID: Number(playerId) },
      data: { Player_name: newName },
    });

    return NextResponse.json({ success: true, player: updatedPlayer });
  } catch (error) {
    console.error("❌ Error updating username:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
