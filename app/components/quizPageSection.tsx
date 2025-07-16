"use client";
import React, { useEffect, useState } from "react";
import QuizCard from "./quizCard";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { saveResultIfHigher } from "@/utils/fResults";
import { getBadge, getBadgeProgress } from "./badge";
import SharePopup from "@/app/share/page";

export default function QuizPageSection({ Quizes, levelNumber, levelTitle, player }: any) {
  const len = Quizes.length;
  const router = useRouter();

  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(-1);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [ansCorrect, setAnsCorrect] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [retryCount, setRetryCount] = useState(0); // ✅ replaced retried with retryCount
  const [timer, setTimer] = useState(40);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [rank, setRank] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const [currentBadge, setCurrentBadge] = useState("");
  const [nextBadge, setNextBadge] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  const quizer = Quizes[questionNumber];
  const totalScore = player?.Playerpoint ? player.Playerpoint + score : score;
  const [correctStreak, setCorrectStreak] = useState(0);


  useEffect(() => {
    setTimer(40);
    setIsTimeUp(false);
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setIsTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [questionNumber]);

  useEffect(() => {
    const saveFinalResult = async () => {
      if (questionNumber >= len) {
        const finalScore = score;
        await saveResultIfHigher({
          playerId: player.Player_ID,
          levelId: parseInt(levelNumber),
          correct: correctAnswersCount,
          incorrect: len - correctAnswersCount,
          score: finalScore,
        });

        const finalTotalScore = player?.Playerpoint ? player.Playerpoint + finalScore : finalScore;
        const badge = getBadge(finalTotalScore);

        await fetch("/api/player/updateBadge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerId: player.Player_ID, badge }),
        });
      }
    };
    saveFinalResult();
  }, [questionNumber, correctAnswersCount, len, levelNumber, player.Player_ID, score]);

  const setDefault = () => {
    setSelectedAnswer(-1);
    setAnswerChecked(false);
    setAnsCorrect(false);
    setUsedHint(false);
    setRetryCount(0); // ✅ reset retry count per question
  };

  const handleScore = async () => {
  setAnswerChecked(true);

  const isCorrect = selectedAnswer === quizer.test_answer && !isTimeUp;

  if (isCorrect) {
    let addedScore = 0;

    if (retryCount === 0) {
      addedScore = 10;
    } else if (retryCount === 1) {
      addedScore = 7;
    } else {
      addedScore = 0; // ✅ no points on third+ retry
    }

    const newScore = score + addedScore;
    setScore(newScore);
    setCorrectAnswersCount(correctAnswersCount + 1);

    // ✅ Increment and save correct streak
    const updatedStreak = correctStreak + 1;
    setCorrectStreak(updatedStreak);




    await fetch("/api/player/updateStreak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerId: player.Player_ID,
        correctStreak: updatedStreak,
      }),
    });

    // ✅ Update rank
    const res = await fetch("/api/quiz/rank", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId: player.Player_ID }),
    });

    const data = await res.json();
    setRank(data.rank);
  } else {
    // ❌ Incorrect or time's up → reset streak
    setCorrectStreak(0);

    await fetch("/api/player/updateStreak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerId: player.Player_ID,
        correctStreak: 0,
      }),
    });
  }
};


  const handleNextQuestion = () => {
    if (questionNumber < len) {
      setQuestionNumber(questionNumber + 1);
      setDefault();
    }
  };
  const handleRetry = () => {
  setSelectedAnswer(-1);
  setAnswerChecked(false);
  setRetryCount((prev) => prev + 1);
  setUsedHint(false); // Optional: reset hint usage if you want
};


  const handleNextLevel = async () => {
    const nextLevel = Number(levelNumber) + 1;
    const playerId = player?.Player_ID;

    try {
      const response = await fetch("/api/updateScore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, finalScore: score, newlevel: nextLevel }),
      });

      if (response.ok) {
        router.push(`/quiz/${nextLevel}`);
      } else {
        const errorData = await response.json();
        console.error("Score update failed:", errorData.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    if (quizFinished) {
      const { currentBadge, nextBadge, progress } = getBadgeProgress(Number(totalScore));
      setCurrentBadge(currentBadge);
      setNextBadge(nextBadge);
      setProgress(progress);

      const badge = getBadge(totalScore);

      fetch("/api/player/updateBadge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: player.Player_ID, badge }),
      });
    }
  }, [quizFinished, totalScore, levelNumber]);

  useEffect(() => {
    setAnimatedProgress(0);
    setShowProgress(false);
    let frame = 0;
    const target = progress;

    const delay = setTimeout(() => {
      setShowProgress(true);
      const interval = setInterval(() => {
        frame++;
        const step = Math.min((frame / 100) * target, target);
        setAnimatedProgress(Math.floor(step));
        if (step >= target) clearInterval(interval);
      }, 10);
    }, 300);

    return () => clearTimeout(delay);
  }, [progress]);

  return !quizFinished ? (
    <div className="md:py-16 pt-8 pb-28">
      <div className="container">
        <div className="flex justify-between flex-wrap mb-4">
          <h2 className="title">Level {levelNumber} : {levelTitle}</h2>
          <div className="text-right">
            <p className="text-sm font-medium mb-1">Question: {questionNumber + 1}/{len}</p>
            <p className="text-sm font-semibold mb-1">
              ⏱ Time Left: <span className={timer <= 10 ? "text-red-600 font-bold" : ""}>{timer}s</span>
            </p>
            {isTimeUp && (
              <p className="text-xs text-red-500 font-medium">
                ⏰ Time’s up! You can still answer, but no points will be given.
              </p>
            )}
            <div className="mt-2 p-2 bg-white inline-block rounded shadow text-sm">
              <p>Score: <strong>{score}</strong></p>
              <p>Rank: <strong>{rank}</strong></p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="flex justify-start md:gap-20">
          <div className="flex-1">
            <QuizCard
              Question={quizer.question}
              CorrectAns={quizer.test_answer}
              Answers={quizer.answers}
              selectedAnswer={selectedAnswer}
              setSelectedAnswer={setSelectedAnswer}
              checked={answerChecked}
              setAnsCorrect={setAnsCorrect}
            />

            <div className="mt-10">
              {answerChecked ? (
                !ansCorrect ? (
                  <div>
                    <div className="flex gap-10">
                      <button className="quizPbtn" onClick={handleRetry} disabled={usedHint}>
                        Retry
                      </button>
                      <button className="quizSbtn" onClick={() => {
                        setSelectedAnswer(quizer.test_answer);
                        setUsedHint(true);
                      }}>
                        Display Answer
                      </button>
                    </div>
                    {retryCount >= 2 && (
                      <p className="mt-4 text-sm text-red-600">
                        ⚠️ You will not earn points on this attempt.
                      </p>
                    )}
                    <p className="mt-6 text-sm absolute">You can use Display Answer to force move to next question without any point</p>
                  </div>
                ) : (
                  <div className="flex">
                    <button className="quizPbtn ml-auto" onClick={() => {
                      if (questionNumber < len - 1) {
                        handleNextQuestion();
                      } else {
                        setQuestionNumber(len);
                        setQuizFinished(true);
                      }
                    }}>
                      {questionNumber < len - 1 ? "Next Question" : "Finish Quiz"}
                    </button>
                  </div>
                )
              ) : (
                <button className="quizPbtn" onClick={handleScore} disabled={selectedAnswer === -1}>
                  Check Answer
                </button>
              )}
            </div>
          </div>

          <div className="hidden md:block flex-1/2 w-100">
            <Image
              src={isTimeUp ? "/mascot/sadMascot.svg" : answerChecked ? (ansCorrect ? "/mascot/greetingMascot.svg" : "/mascot/sadMascot.svg") : "/mascot/proudMascot.svg"}
              alt="Guhuza Mascot"
              height={100}
              width={200}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    // ✅ Quiz Finished View (unchanged)
    <div className="md:py-16 py-8">
      <div className="container">
        <div className="flex flex-col items-center">
          <h1 className="title text-center">Lesson Complete!</h1>
          <div className="text-center mt-6 mb-10 bg-blue-900 text-white py-4 px-6 rounded-xl shadow-md w-full max-w-xl mx-auto">
            <h2 className="text-xl font-bold mb-1">
              🏅 Your Current Badge: <span className="text-yellow-300">{currentBadge}</span>
            </h2>
            {nextBadge && (
              <div>
                <p className="text-sm">Next Badge: <strong>{nextBadge}</strong></p>
                <div className="w-full bg-blue-700 h-4 rounded-full mt-2 overflow-hidden">
                  {showProgress && (
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-700 ease-out"
                      style={{ width: `${animatedProgress}%` }}
                    ></div>
                  )}
                </div>
                <p className="text-xs mt-1">{animatedProgress}% Progress toward {nextBadge}</p>
              </div>
            )}
          </div>

          <p className="text-lg font-medium text-center mt-2 text-gray-700">
            ✅ Answer: {correctAnswersCount}/{len}
          </p>

          <div className="flex flex-wrap-reverse justify-center gap-8 items-center">
            <div className="flex flex-col gap-8 mt-6 justify-center">
              <div className="bg-yellow-50 rounded border-2 border-yellow-300 gap-4 flex flex-col items-center px-6 py-4">
                <p className="mt-4 text-xl">⭐ PTS GAINED</p>
                <h1 className="text-6xl font-bold">{score}</h1>
              </div>
              <div className="bg-blue-50 rounded border-2 border-blue-100 flex flex-col gap-4 items-center px-6 py-4">
                <p className="mt-4 text-xl">🏆 TOTAL SCORE</p>
                <h1 className="text-6xl font-bold">{player?.Playerpoint + score}</h1>
              </div>
            </div>
            <Image
              src="/mascot/proudMascot.svg"
              className="mt-8"
              width={250}
              alt="Guhuza Bird"
              height={30}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-20">
            <button className="quizPbtn" onClick={handleRetry}>↻ Retry</button>
            <button className="quizPbtn" onClick={handleNextLevel}>Next Level</button>
            <SharePopup score={score} player={player} levelTitle={levelTitle} buttonClass="quizPbtn" />
          </div>
        </div>
      </div>
    </div>
  );
}
