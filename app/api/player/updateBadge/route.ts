import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { playerId, badge } = await req.json();

    // ✅ Debug log
    console.log("🔔 Updating badge for player:", playerId, "Badge:", badge);

    if (!playerId || typeof badge !== "string") {
      return NextResponse.json({ success: false, error: "Missing or invalid playerId or badge" }, { status: 400 });
    }

    const updated = await prisma.player.update({
      where: { Player_ID: playerId },
      data: { badge },
    });

    return NextResponse.json({ success: true, badge: updated.badge });
  } catch (error) {
    console.error("❌ Badge update error:", error);
    return NextResponse.json({ success: false, error: "Badge update failed" }, { status: 500 });
  }
}
