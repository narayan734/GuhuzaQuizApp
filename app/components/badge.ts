export const badgeMilestones = [
  { badge: "Amature", score: 70 },
  { badge: "Silver", score: 150 },
  { badge: "Gold", score: 275 },
  { badge: "Platinium", score: 450 },
  { badge: "Diamond", score: 750 },
  { badge: "Heroic", score: 1000 },
  { badge: "Master", score: 1300 },
];

// Badge is now based only on score
export function getBadge(score: number): string {
  const reversed = badgeMilestones.slice().reverse();
  for (let milestone of reversed) {
    if (score >= milestone.score) {
      return milestone.badge;
    }
  }
  return "None";
}

// Progress bar logic based only on score
export function getBadgeProgress(score: number) {
  const current = badgeMilestones
    .slice()
    .reverse()
    .find((b) => score >= b.score);

  const next = badgeMilestones.find(
    (b) => b.score > (current?.score ?? 0)
  );

  let progress = 100;
  if (next) {
    const scorePercent = Math.min(score / next.score, 1);
    progress = Math.floor(scorePercent * 100);
  }

  return {
    currentBadge: current?.badge || "None",
    nextBadge: next?.badge || null,
    progress,
  };
}console.log(getBadge(80));  // Expected: "Amature"

