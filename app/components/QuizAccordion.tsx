"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import StarRating from "./StarRating";
import Pbtn from "./buttons/primarybtn";

type Level = {
  Level_Id: number;
  Level_Title: string;
  Level_number: number;
};

type QuizResult = {
  Level_Id: number;
  correct: number;
  total: number;
};

type Props = {
  allLevels: Level[];
  playerLevel: number;
  playerId: number;
  quizResults: QuizResult[];
};

const QuizAccordion = ({ allLevels, playerLevel, playerId, quizResults }: Props) => {
  const [activeSet, setActiveSet] = useState<number | null>(null);

  const levelGroups = [
    { id: 1, title: "Levels 1–10", start: 1, end: 10 },
    { id: 2, title: "Levels 11–20", start: 11, end: 20 },
    { id: 3, title: "Levels 21–30", start: 21, end: 30 },
    { id: 4, title: "Levels 31–40", start: 31, end: 40 },
    { id: 5, title: "Levels 41–50", start: 41, end: 50 },
  ];

  const handleToggle = (id: number) => {
    setActiveSet(activeSet === id ? null : id);
  };

  const getResultForLevel = (levelId: number) =>
  (quizResults ?? []).find((res) => res.Level_Id === levelId);


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <h1 className="text-3xl font-bold mb-4">All Quiz</h1>
      <p className="mb-8">Click to expand and see available quizzes.</p>

      <div className="space-y-4">
        {levelGroups.map((group) => {
          const levels = allLevels.filter(
            (level) =>
              level.Level_number >= group.start &&
              level.Level_number <= group.end
          );

          return (
            <div key={group.id}>
              <button
                onClick={() => handleToggle(group.id)}
                className="flex justify-between items-center w-full bg-[#0a1a2f] text-white py-3 px-4 rounded-md shadow hover:bg-[#122c49] transition duration-200"
              >
                <span className="text-xl font-semibold">{group.title}</span>
                {activeSet === group.id ? <ChevronUp /> : <ChevronDown />}
              </button>

              {activeSet === group.id && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {levels.map((level) => {
                    const isUnlocked = level.Level_number <= playerLevel;
                    const result = getResultForLevel(level.Level_Id);
                    const correct = result?.correct ?? null;
                    const total = result?.total ?? null;

                    return (
                      <div
                        key={level.Level_Id}
                        className="bg-[#0a1a2f] text-white p-6 rounded-lg shadow-md w-full min-h-[200px] flex flex-col justify-between relative transition-transform duration-300 hover:scale-105 hover:shadow-[0_4px_20px_rgba(255,123,0,0.6)]"
                      >
                        {correct != null && total != null && (
                          <div className="absolute top-3 right-3 bg-white rounded-md px-2 py-1">
                            <StarRating score={(correct / total) * 100} />
                          </div>
                        )}

                        <div className="flex gap-4">
                          <div className="flex items-center justify-center bg-blue-400 border-blue-400 text-[#191A23] w-8 h-8 rounded-full border-2 mb-4">
                            <p className="font-bold">{level.Level_number}</p>
                          </div>

                          <div>
                            <h3 className="text-2xl font-semibold mb-2">
                              {level.Level_Title}
                            </h3>
                            <p>Number of Questions: 10</p>

                            {correct != null && total != null && (
                              <p className="text-green-400 font-semibold mt-1">
                                ✅ Answer: {correct}/{total}
                              </p>
                            )}

                            <div className="mt-4 flex gap-2">
                              {isUnlocked ? (
                                <>
                                  {correct != null && total != null && (
                                    <Pbtn
                                      message="Retry"
                                      toDestination={`/quiz/level/${level.Level_Id}`}
                                    />
                                  )}
                                  <Pbtn
                                    message="Start Quiz"
                                    toDestination={`/quiz/level/${level.Level_Id}`}
                                  />
                                </>
                              ) : (
                                <p className="text-sm text-red-400 font-semibold mt-2">
                                  🔒 Locked
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizAccordion;
