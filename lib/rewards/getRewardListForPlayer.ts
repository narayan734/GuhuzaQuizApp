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
    description: "Reach Level 4 to earn 30 points.",
    type: "milestone",
    unlockLevel: 4,
    points: 30,
  },
  {
  id: 12,
  title: "Reach Level 5",
  description: "Earn 35 points when you reach Level 5.",
  type: "milestone",
  unlockLevel: 5,
  points: 35,
},
{
  id: 13,
  title: "Reach Level 10",
  description: "You earned 50 points for reaching Level 10!",
  type: "milestone",
  unlockLevel: 10,
  points: 50,
},
{
  id: 14,
  title: "Reach Level 15",
  description: "Great job! You get 65 points for Level 15.",
  type: "milestone",
  unlockLevel: 15,
  points: 65,
},
{
  id: 15,
  title: "Reach Level 20",
  description: "You're doing amazing! 75 points awarded.",
  type: "milestone",
  unlockLevel: 20,
  points: 75,
},
{
  id: 16,
  title: "Reach Level 25",
  description: "Halfway through! Get 80 bonus points.",
  type: "milestone",
  unlockLevel: 25,
  points: 80,
},
{
  id: 17,
  title: "Reach Level 30",
  description: "You're on fire! 100 points for reaching Level 30.",
  type: "milestone",
  unlockLevel: 30,
  points: 100,
},
{
  id: 18,
  title: "Reach Level 35",
  description: "You're unstoppable! 150 points earned.",
  type: "milestone",
  unlockLevel: 35,
  points: 150,
},
{
  id: 19,
  title: "Reach Level 40",
  description: "Legend in the making. Enjoy 200 points!",
  type: "milestone",
  unlockLevel: 40,
  points: 200,
},
{
  id: 20,
  title: "Reach Level 45",
  description: "So close! Grab 250 points now.",
  type: "milestone",
  unlockLevel: 45,
  points: 250,
},
{
  id: 21,
  title: "Reach Level 50",
  description: "Ultimate Champion! Claim 300 points.",
  type: "milestone",
  unlockLevel: 50,
  points: 300,
},

  {
    id: 4,
    title: "Reach 250 Points",
    description: "Earn extra 15 points on reaching 250 Points.",
    type: "points",
    requiredPoints: 250,
    points: 15,
  },
  {
    id: 5,
    title: "Reach 500 Points",
    description: "Earn extra 50 points on reaching 500 Points.",
    type: "points",
    requiredPoints: 500,
    points: 50,
  },
  {
    id: 22,
    title: "Reach 750 Points",
    description: "Earn extra 75 points on reaching 750 Points.",
    type: "points",
    requiredPoints: 750,
    points: 75,
  },
  {
    id: 23,
    title: "Reach 1000 Points",
    description: "Earn extra 100 points on reaching 1000 Points.",
    type: "points",
    requiredPoints: 1000,
    points: 100,
  },
  {
    id: 24,
    title: "Reach 1500 Points",
    description: "Earn extra 150 points on reaching 1500 Points.",
    type: "points",
    requiredPoints: 1500,
    points: 150,
  },
  {
    id: 25,
    title: "Reach 2000 Points",
    description: "Earn extra 50 points on reaching 2000 Points.",
    type: "points",
    requiredPoints: 2000,
    points: 250,
  },
  {
    id: 6,
    title: "3-Day Streak",
    description: "Play daily for 3 days to earn 5 points.",
    type: "streak",
    requiredDays: 3,
    points: 5,
  },
  {
    id: 26,
    title: "5-Day Streak",
    description: "Play daily for 5 days to earn 10 points.",
    type: "streak",
    requiredDays: 5,
    points: 10,
  },
  {
    id:27 ,
    title: "15-Day Streak",
    description: "Play daily for 15 days to earn 50 points.",
    type: "streak",
    requiredDays: 15,
    points: 50,
  },
  {
    id: 7,
    title: "5 Correct Answers in a Row",
    description: "Get 5 correct answers in a row to earn 10 points.",
    type: "correctStreak",
    requiredStreak: 5,
    points: 10,
  },
  {
    id: 28,
    title: "15 Correct Answers in a Row",
    description: "Get 15 correct answers in a row to earn 100 points.",
    type: "correctStreak",
    requiredStreak: 15,
    points: 100,
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
