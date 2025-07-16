import { NextRequest, NextResponse } from "next/server";
import { getRewardListForPlayer } from "@/lib/rewards/getRewardListForPlayer";
import prisma from "@/lib/prisma";

// Static reward definitions
const rewardDefinitions = [
  { id: 1, type: "milestone", unlockLevel: 1, points: 10 },
  { id: 2, type: "milestone", unlockLevel: 2, points: 25 },
  { id: 3, type: "milestone", unlockLevel: 4, points: 50 },
  { id: 4, type: "points", requiredPoints: 250, points: 0 },
  { id: 5, type: "points", requiredPoints: 500, points: 0 },
  { id: 6, type: "streak", requiredDays: 3, points: 20 },
  { id: 7, type: "correctStreak", requiredStreak: 5, points: 30 },
  { id: 8, type: "correctStreak", requiredStreak: 10, points: 100 },
  { id: 9, type: "referral", requiredInvites: 1, points: 25 },
  { id: 10, type: "referral", requiredInvites: 2, points: 50 },
  { id: 11, type: "referral", requiredInvites: 3, points: 100 },
];

// ✅ GET /api/reward?playerId=123
export async function GET(req: NextRequest) {
  const playerId = Number(req.nextUrl.searchParams.get("playerId"));
  if (!playerId) {
    return NextResponse.json({ error: "Missing playerId" }, { status: 400 });
  }

  try {
    const rewards = await getRewardListForPlayer(playerId);
    return NextResponse.json(rewards);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load rewards", details: error },
      { status: 500 }
    );
  }
}

// ✅ POST /api/reward
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { playerId, rewardId, action } = body;

    if (!playerId) {
      return NextResponse.json({ message: "Missing playerId" }, { status: 400 });
    }

    // ✅ Handle invite action (simulate referral)
    if (action === "invite") {
      const player = await prisma.player.findUnique({
        where: { Player_ID: playerId },
      });

      if (!player) {
        return NextResponse.json({ message: "Player not found" }, { status: 404 });
      }

      await prisma.player.update({
        where: { Player_ID: playerId },
        data: {
          referrals: (player.referrals ?? 0) + 1, // or `invitesSent` if that’s your schema field
        },
      });

      
      const updated = await prisma.player.findUnique({ where: { Player_ID: playerId } });




      return NextResponse.json({ message: "Invite recorded successfully." });
    }

    // ✅ Claim reward logic
    if (!rewardId) {
      return NextResponse.json(
        { message: "Missing rewardId" },
        { status: 400 }
      );
    }

    const rewardRow = await prisma.milestone.findUnique({
      where: { Milestone_Id: rewardId },
    });

    if (!rewardRow) {
      return NextResponse.json({ message: "Reward not found" }, { status: 404 });
    }

    const player = await prisma.player.findUnique({
      where: { Player_ID: playerId },
    });

    if (!player) {
      return NextResponse.json({ message: "Player not found" }, { status: 404 });
    }

    const def = rewardDefinitions.find((r) => r.id === rewardId);
    if (!def) {
      return NextResponse.json({ message: "Invalid reward definition." }, { status: 400 });
    }

    const type = def.type;
    const unlockingLevel =
      def.unlockLevel ??
      def.requiredPoints ??
      def.requiredDays ??
      def.requiredStreak ??
      def.requiredInvites ??
      0;

    let isClaimable = false;

    if (type === "milestone" && player.Level_Id >= unlockingLevel) {
      isClaimable = true;
    } else if (type === "streak" && player.streak >= unlockingLevel) {
      isClaimable = true;
    } else if (type === "points" && player.Playerpoint >= unlockingLevel) {
      isClaimable = true;
    } else if (type === "correctStreak" && (player.correctStreak ?? 0) >= unlockingLevel) {
      isClaimable = true;
    } else if (type === "referral" && (player.referrals ?? 0) >= unlockingLevel) {
      isClaimable = true;
    }

    console.log("🔍 Claim Debug Info", {
      type,
      unlockingLevel,
      playerLevel: player.Level_Id,
      playerStreak: player.streak,
      playerPoints: player.Playerpoint,
      correctStreak: player.correctStreak,
      referrals: player.referrals,
    });

    if (!isClaimable) {
      return NextResponse.json(
        { message: "Reward is not yet claimable." },
        { status: 403 }
      );
    }

    const alreadyClaimed = await prisma.claimedReward.findFirst({
      where: { playerId, rewardId },
    });

    if (alreadyClaimed) {
      return NextResponse.json({ message: "Reward already claimed." }, { status: 409 });
    }

    const rewardPoints = def.points ?? 0;

    if (rewardPoints > 0) {
      await prisma.player.update({
        where: { Player_ID: playerId },
        data: {
          Playerpoint: player.Playerpoint + rewardPoints,
        },
      });
    }

    const claimed = await prisma.claimedReward.create({
      data: {
        playerId,
        rewardId,
        claimedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: `Reward claimed! You earned ${rewardPoints} points.`,
      claimed,
    });
  } catch (e) {
    console.error("🔥 Error in /api/reward POST:", e);
    return NextResponse.json(
      {
        message: "❌ Failed to claim reward",
        error: e instanceof Error ? e.message : e,
      },
      { status: 500 }
    );
  }
}
