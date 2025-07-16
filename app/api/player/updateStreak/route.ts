import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { playerId, correctStreak } = await req.json();

     console.log("🟢 Received updateStreak request:", { playerId, correctStreak }); // ✅ Add this


    if (!playerId || correctStreak === undefined) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    await prisma.player.update({
      where: { Player_ID: playerId },
      data: { correctStreak },
    });

    const updated = await prisma.player.update({
  where: { Player_ID: playerId },
  data: { correctStreak },
});
console.log("✅ DB updated:", updated);


    

    return NextResponse.json({ message: "Streak updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Streak update error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
