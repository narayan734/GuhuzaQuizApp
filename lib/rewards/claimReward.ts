import prisma from "@/lib/prisma";
import { getRewardListForPlayer } from "./getRewardListForPlayer";

export const claimReward = async (playerId: number, rewardId: number) => {
  const rewards = await getRewardListForPlayer(playerId);
  const rewardToClaim = rewards.find(r => r.id === rewardId);

  if (!rewardToClaim) {
    throw new Error("Reward not found.");
  }

  if (!rewardToClaim.claimable || rewardToClaim.claimed || rewardToClaim.progress < 100) {
    throw new Error("Reward is not claimable.");
  }

  // ✅ Prevent duplicate claims
  const alreadyClaimed = await prisma.claimedReward.findFirst({
    where: { playerId, rewardId },
  });

  if (alreadyClaimed) {
    throw new Error("Reward already claimed.");
  }

  // ✅ Handle reward types
  if (rewardToClaim.type === "milestone") {
    // Optional: Unlock something or just log the claim
  }

  if (rewardToClaim.type === "points") {
    await prisma.player.update({
      where: { Player_ID: playerId },
      data: {
        Playerpoint: {
          increment: rewardToClaim.rewardPoints ?? 0,
        },
      },
    });
  }

  if (rewardToClaim.type === "streak") {
    // Optional: Add bonus points or mark streak badge
  }

  // ✅ Save the claimed reward
  await prisma.claimedReward.create({
    data: {
      playerId,
      rewardId,
      claimedAt: new Date(),
    },
  });

  return { success: true, rewardId, message: "Reward successfully claimed!" };
};
