"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getBadgeProgress } from "./badge";
import BadgeImage from "./BadgeImage";

type ProgressBarType = {
  percentage: number;
  nextScore?: number;
};

const ProgressBar = ({ percentage, nextScore }: ProgressBarType) => {
  return (
    <div className="relative w-full bg-gray-200 rounded-full h-4 mt-2">
      <div
        className="bg-blue-600 text-xs font-medium text-blue-100 text-center leading-none rounded-full h-4"
        style={{ width: `${percentage}%` }}
      />
      {nextScore !== undefined && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-800 bg-white px-1 rounded">
          {nextScore} pts
        </div>
      )}
    </div>
  );
};

type milestoneType = {
  Milestone_Id: number;
  Milestone_Title: string;
  Milestone_description: string;
  UnlockingLevel: number;
  Milestone_reward_message: string;
  Milestone_Link: string;
  Milestone_Button_CTA: string;
};

type playerType = {
  Player_ID: number;
  Player_name: string;
  Playerpoint: number;
  streak: number;
  lastLogin: Date;
  Level_Id: number;
  Milestone_Id?: number;
  milestone: milestoneType;
};

type typePlayerHeroSection = {
  player: playerType;
  playerRank: number;
};

function ProfileHerosection({ player, playerRank }: typePlayerHeroSection) {
  const router = useRouter();

  const [currentBadge, setCurrentBadge] = useState("None");
  const [nextBadge, setNextBadge] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [nextScore, setNextScore] = useState<number | null>(null);

  useEffect(() => {
    const { currentBadge, nextBadge, progress, nextScore } = getBadgeProgress(
      player?.Playerpoint || 0
    );
    setCurrentBadge(currentBadge);
    setNextBadge(nextBadge);
    setProgress(progress);
    setNextScore(nextScore);
  }, [player?.Playerpoint]);

  const handleClaimReward = () => {
    router.push("/reward");
  };

  return (
    <div className="container mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Hello {player?.Player_name}
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Card (reduced height & width) */}

        <div className="bg-blue-50 rounded-lg shadow-md flex-1 px-4 py-3 max-w-[750px]">
  <div className="flex flex-col md:flex-row justify-between items-center mb-2">
    {/* Badge Column */}
    <div className="animate-badge-pulse">
      <BadgeImage badge={currentBadge} />
     
      
    </div>

    {/* Stats Column */}
    <div className="flex flex-col md:flex-row justify-around w-full md:w-2/3 text-center gap-4">
      <div>
        <p className="text-xs text-gray-500">Ranking</p>
        <p className="text-3xl font-bold">{playerRank}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500">Points Earned</p>
        <p className="text-3xl font-bold">{player?.Playerpoint}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500">Level</p>
        <p className="text-3xl font-bold">{player?.Level_Id}</p>
      </div>
    </div>
  </div>

  {/* Streak */}
  <div className="text-center mb-2 mt-1">
    <span className="text-orange-500 text-base mr-1">🔥</span>
    <span className="text-base text-gray-700">
      {player?.streak} Days Streak
    </span>
  </div>

  {/* Badge Progress */}
  <div className="bg-blue-900 text-white px-4 py-3 rounded-lg mt-2">
    <h2 className="text-sm font-bold mb-1">
      🏅 Your Current Badge:{" "}
      <span className="text-yellow-300">{currentBadge}</span>
    </h2>
    {nextBadge && (
      <>
        <p className="text-sm mb-1">Next Badge: {nextBadge}</p>
        <div className="w-full">
          <ProgressBar percentage={progress} nextScore={nextScore!} />
          <p className="text-xs mt-1">
            {progress}% Progress toward {nextBadge}
          </p>
        </div>
      </>
    )}
  </div>
</div>

        

        {/* Right – Milestone Reward */}
        <div className="bg-white rounded-lg shadow-md px-6 py-6 w-full max-w-xs self-start">
          <div className="flex flex-col items-center">
            <Image
              src="/ProfileGraphics/Gift.svg"
              alt="Gift"
              width={80}
              height={100}
            />
            <p className="text-sm text-center mt-2 text-gray-700">
              Solve{" "}
              {Math.max(
                0,
                (player?.milestone?.UnlockingLevel ?? 0) -
                  (player?.Level_Id ?? 0)
              )}{" "}
              more level to get your reward
            </p>


            <button
              className="quizPbtn mt-4 w-full"
              
              onClick={handleClaimReward}
            >
              Claim Reward
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHerosection;
