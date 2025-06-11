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
}: {
  allLevels: levelsType;
  cutEnding: boolean;
  playerLevel: number;
  playerId: number;
}) {
  const quizResults = await fetchResultsByPlayer(playerId);
  const displayLevel = playerLevel;

  const filteredLevels = allLevels
    .filter((level: levelType) => level.Level_Id <= displayLevel)
    .sort((a, b) => b.Level_Id - a.Level_Id);

  const endingPoint = cutEnding
    ? (filteredLevels[0]?.Level_Id ?? 4) - 3
    : 0;

  return (
    <div className="">
      {filteredLevels.map((level: levelType) => {
        const result = quizResults.find(
          (r) => r.levelId === level.Level_Id
        );
        return (
          level.Level_Id > endingPoint && (
            <QuizLevelCard
              key={level.Level_Id}
              levelNumber={level.Level_Id}
              levelLink={`quiz/${level.Level_Id}`}
              levelName={level.Level_Title}
              currentLevel={displayLevel}
              correct={result?.correct ?? null}
              total={result?.incorrect != null && result?.correct != null
                ? result.correct + result.incorrect
                : null}
            />
          )
        );
      })}
    </div>
  );
}

export default QuizList;
