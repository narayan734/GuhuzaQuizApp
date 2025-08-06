import React from "react";
import QuizLevelCard from "./quizLevelCard";
import { fetchResultsByPlayer } from "@/utils/fResults";

type levelType = {
  Level_Id: number;
  Level_Title: string;
  Level_number: number;
};

type levelsType = levelType[];

async function QuizList({
  allLevels,
  cutEnding = true,
  playerLevel,
  playerId,
  showOnlyPlayed = false,
  showCurrentLevel = false,
  customLevels,
}: {
  allLevels: levelsType;
  cutEnding: boolean;
  playerLevel: number;
  playerId: number;
  showOnlyPlayed?: boolean;
  showCurrentLevel?: boolean;
  customLevels?: levelType[];
}) {
  // ✅ Defensive fallback if fetch fails
  const quizResults = (await fetchResultsByPlayer(playerId)) ?? [];

  let filteredLevels: levelType[] = [];

  // ✅ Use customLevels override (from QuizAccordion)
  if (customLevels && customLevels.length > 0) {
    filteredLevels = customLevels;
  }
  // ✅ Show only played levels
  else if (showOnlyPlayed) {
    const playedIds = quizResults.map((r) => r.levelId);
    filteredLevels = allLevels.filter(
      (level) =>
        playedIds.includes(level.Level_Id) ||
        (showCurrentLevel && level.Level_Id === playerLevel)
    );
  }
  // ✅ Show last 3 levels if cutEnding = true
  else if (cutEnding) {
    filteredLevels = allLevels.filter((level) => level.Level_Id <= playerLevel);

    // Include current level if not already in
    if (
      showCurrentLevel &&
      !filteredLevels.some((l) => l.Level_Id === playerLevel)
    ) {
      const current = allLevels.find((l) => l.Level_Id === playerLevel);
      if (current) filteredLevels.push(current);
    }

    // Keep only last 3 levels + current
    const highestId = Math.max(...filteredLevels.map((l) => l.Level_Id));
    filteredLevels = filteredLevels.filter(
      (l) => l.Level_Id >= highestId - 2 || l.Level_Id === playerLevel
    );
  }
  // ✅ Show everything
  else {
    filteredLevels = [...allLevels];
  }

  // ✅ Sort descending
  filteredLevels = filteredLevels.sort((a, b) => b.Level_Id - a.Level_Id);

  return (
    <div className="max-w-screen-xl mx-auto px-6 pb-20">
      {filteredLevels.length === 0 ? (
        <p className="text-center text-gray-500">No quiz history to show.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLevels.map((level) => {
            const result = quizResults.find(
              (r) => r.levelId === level.Level_Id
            );

            return (
              <QuizLevelCard
                key={level.Level_Id}
                levelNumber={level.Level_Id}
                levelLink={`/quiz/${level.Level_Id}`} // ✅ fixed relative path
                levelName={level.Level_Title}
                currentLevel={playerLevel}
                correct={result?.correct ?? null}
                total={
                  result?.incorrect != null && result?.correct != null
                    ? result.correct + result.incorrect
                    : null
                }
                score={result?.score ?? null}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default QuizList;
