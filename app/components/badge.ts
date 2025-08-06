export const badgeMilestones = [
  { badge: "Amature", score: 0 },
  { badge: "Silver", score: 100 },
   { badge: "Silver I", score: 250 },
  { badge: "Gold", score: 400 },
  { badge: "Gold I", score: 700 },
  { badge: "Gold II", score: 1000 },
  { badge: "Platinium", score: 1500 },
  { badge: "Platinium I", score: 2000 },
  { badge: "Platinium II", score: 2500 },
  { badge: "Diamond", score: 3000 },
  { badge: "Diamond I", score: 3500 },
  { badge: "Diamond II", score: 4000 },
  { badge: "Heroic", score: 4500 },
  { badge: "Master", score: 5000 },
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
    const range = next.score - (current?.score ?? 0);
    const covered = score - (current?.score ?? 0);
    progress = Math.floor((covered / range) * 100);
  }

  return {
    currentBadge: current?.badge || "None",
    nextBadge: next?.badge || null,
    nextScore: next?.score || null,
    progress,
  };
}

console.log(getBadge(80));  // Expected: "Amature"
console.log(getBadge(80));     // "Amature"
console.log(getBadge(250));    // "Silver I"
console.log(getBadge(1499));   // "Gold II"
console.log(getBadge(2000));   // "Platinium I"
console.log(getBadge(5100));   // "Master"


