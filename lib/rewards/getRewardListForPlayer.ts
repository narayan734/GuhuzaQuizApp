import prisma from "@/lib/prisma";

export type RewardItem = {
  id: number;
  title: string;
  description: string;
  type: "milestone" | "streak" | "referral" | "points" | "correctStreak";
  progress: number; // percentage (0 to 100)
  claimable: boolean;
  claimed: boolean;
  rewardPoints: number;
};

const rewardDefinitions = [
  {
    id: 1,
    title: "Welcome Reward",
    description: "You are awarded with 10 points as wellcome.",
    type: "milestone",
    unlockLevel: 1,
    points: 10,
  },
  {
    id: 2,
    title: "Reach Level 2",
    description: "Reach Level 2 to earn 25 points.",
    type: "milestone",
    unlockLevel: 2,
    points: 25,
  },
  {
    id: 3,
    title: "Reach Level 4",
    description: "Reach Level 4 to earn 50 points.",
    type: "milestone",
    unlockLevel: 4,
    points: 50,
  },
  {
    id: 4,
    title: "Reach 250 Points",
    description: "Earn extra 50 points on reaching 250 Points.",
    type: "points",
    requiredPoints: 250,
    points: 50,
  },
  {
    id: 5,
    title: "Reach 500 Points",
    description: "Earn extra 130 points on reaching 500 Points.",
    type: "points",
    requiredPoints: 500,
    points: 130,
  },
  {
    id: 6,
    title: "3-Day Streak",
    description: "Play daily for 3 days to earn 20 points.",
    type: "streak",
    requiredDays: 3,
    points: 20,
  },
  {
    id: 7,
    title: "5 Correct Answers in a Row",
    description: "Get 5 correct answers in a row to earn 30 points.",
    type: "correctStreak",
    requiredStreak: 5,
    points: 30,
  },
  {
    id: 8,
    title: "10 Correct Answers in a Row",
    description: "Get 10 correct answers in a row to earn 100 points.",
    type: "correctStreak",
    requiredStreak: 10,
    points: 100,
  },
  {
    id: 9,
    title: "Invite 1 Friend",
    description: "Invite 1 friend to earn 25 points.",
    type: "referral",
    requiredInvites: 1,
    points: 25,
  },
  {
    id: 10,
    title: "Invite 2 Friends",
    description: "Invite 2 friends to earn 50 points.",
    type: "referral",
    requiredInvites: 2,
    points: 50,
  },
  {
    id: 11,
    title: "Invite 3 Friends",
    description: "Invite 3 friends to earn 100 points.",
    type: "referral",
    requiredInvites: 3,
    points: 100,
  },
];

export const getRewardListForPlayer = async (
  playerId: number
): Promise<RewardItem[]> => {
  const player = await prisma.player.findUnique({
    where: { Player_ID: playerId },
  });

  if (!player) return [];

  const correctStreak = player.correctStreak ?? 0;
  const referrals = player.referrals ?? 0;

  const rewards: RewardItem[] = [];

  for (const def of rewardDefinitions) {
    let progress = 0;
    let claimable = false;

    // ✅ Check if this reward is claimed by this player
    const claimedRecord = await prisma.claimedReward.findFirst({
      where: {
        playerId,
        rewardId: def.id,
      },
    });

    const claimed = !!claimedRecord;

    // ✅ Check eligibility logic
    if (def.type === "milestone" && def.unlockLevel !== undefined) {
      claimable = !claimed && player.Level_Id >= def.unlockLevel;
      progress = Math.min((player.Level_Id / def.unlockLevel) * 100, 100);
    }

    if (def.type === "streak" && def.requiredDays !== undefined) {
      claimable = !claimed && player.streak >= def.requiredDays;
      progress = Math.min((player.streak / def.requiredDays) * 100, 100);
    }

    if (def.type === "points" && def.requiredPoints !== undefined) {
      claimable = !claimed && player.Playerpoint >= def.requiredPoints;
      progress = Math.min((player.Playerpoint / def.requiredPoints) * 100, 100);
    }

    if (def.type === "correctStreak" && def.requiredStreak !== undefined) {
      claimable = !claimed && correctStreak >= def.requiredStreak;
      progress = Math.min((correctStreak / def.requiredStreak) * 100, 100);
    }

    if (def.type === "referral" && def.requiredInvites !== undefined) {
      claimable = !claimed && referrals >= def.requiredInvites;
      progress = Math.min((referrals / def.requiredInvites) * 100, 100);
    }

    rewards.push({
      id: def.id,
      title: def.title,
      description: def.description,
      type: def.type as RewardItem["type"],
      progress: Math.round(progress),
      claimable,
      claimed,
      rewardPoints: def.points ?? 0,
    });
  }

  return rewards;
};
