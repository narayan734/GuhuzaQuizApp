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
  
}: {
  allLevels: levelsType;
  cutEnding: boolean;
  playerLevel: number;
  playerId: number ;
  showOnlyPlayed?: boolean;
  showCurrentLevel?: boolean;
}) {
  const quizResults = await fetchResultsByPlayer(playerId);

  let filteredLevels: levelType[] = [];

  if (showOnlyPlayed) {
    const playedIds = quizResults.map((r) => r.levelId);
    filteredLevels = allLevels.filter(
      (level) =>
        playedIds.includes(level.Level_Id) ||
        (showCurrentLevel && level.Level_Id === playerLevel)
    );
  } else if (cutEnding) {
    filteredLevels = allLevels.filter((level) => level.Level_Id <= playerLevel);

    // ✅ Include current level if missing
    if (
      showCurrentLevel &&
      !filteredLevels.some((l) => l.Level_Id === playerLevel)
    ) {
      const current = allLevels.find((l) => l.Level_Id === playerLevel);
      if (current) filteredLevels.push(current);
    }

    // ✅ Apply cut limit: last 3 levels + current
    const highestId = Math.max(...filteredLevels.map((l) => l.Level_Id));
    filteredLevels = filteredLevels.filter(
      (l) => l.Level_Id >= highestId - 2 || l.Level_Id === playerLevel
    );
  } else {
    // ✅ show everything
    filteredLevels = [...allLevels];
  }

  // ✅ Sort latest first
  filteredLevels = filteredLevels.sort((a, b) => b.Level_Id - a.Level_Id);

  return (
    <div className="max-w-screen-xl mx-auto px-6 pb-20" 
    
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredLevels.map((level) => {
          const result = quizResults.find((r) => r.levelId === level.Level_Id);

          return (
            <QuizLevelCard
              key={level.Level_Id}
              levelNumber={level.Level_Id}
              levelLink={`quiz/${level.Level_Id}`}
              levelName={level.Level_Title}
              currentLevel={playerLevel}
              correct={result?.correct ?? null}
              total={ result?.incorrect != null && result?.correct != null ? result.correct + result.incorrect : null}
              score={result?.score ?? null}
            />
          );
        })}
      </div>
    </div>
  );
}

export default QuizList;
