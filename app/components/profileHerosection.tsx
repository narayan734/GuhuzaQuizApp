"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getBadgeProgress } from "./badge"; 

type ProgressBarType = {
  percentage: number;
};

const ProgressBar = ({ percentage }: ProgressBarType) => {
  return (
    <div className="w-full bg-gray-200 rounded-full dark:bg-gray-300">
      <div
        className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
        style={{ width: `${percentage}%` }}
      >
        {Math.floor(percentage)}%
      </div>
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

  // Static badge progress
  const [currentBadge, setCurrentBadge] = useState("None");
  const [nextBadge, setNextBadge] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const { currentBadge, nextBadge, progress } = getBadgeProgress(player?.Playerpoint || 0);
    setCurrentBadge(currentBadge);
    setNextBadge(nextBadge);
    setProgress(progress);
  }, [player?.Playerpoint]);

  const handleClaimReward = () => {
    router.push("/reward");
  };

  return (
    <div className="container mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Hello {player?.Player_name}
      </h1>
      <div className="flex flex-col flex-wrap md:flex-row gap-8 md:gap-12">
        {/* Left Section */}
        <div className="flex-1">
          <div className="rounded-lg bg-blue-50">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 py-6">
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-1">Ranking</p>
                <p className="text-5xl font-bold text-gray-800">{playerRank}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-1">Points Earned</p>
                <p className="text-5xl font-bold text-gray-800">{player?.Playerpoint}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-1">Level</p>
                <p className="text-5xl font-bold text-gray-800">{player?.Level_Id}</p>
              </div>
            </div>

            {/* Streak Display */}
            <div className="flex items-center justify-center bg-blue-50 py-4 w-full">
              <span className="text-blue-300 mr-2 text-xl">🔥</span>
              <p className="text-gray-700 text-xl font-medium">
                {player?.streak} Days Streak
              </p>
            </div>

            {/* Badge Display */}
            <div className="bg-blue-900 text-white px-6 py-4 rounded-b-lg shadow-inner">
              <h2 className="text-lg font-bold mb-1">
                🏅 Your Current Badge: <span className="text-yellow-300">{currentBadge}</span>
              </h2>
              {nextBadge && (
                <>
                  <p className="text-base font-medium">Next Badge: <strong>{nextBadge}</strong></p>
                  <div className="w-full bg-blue-700 h-4 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm mt-1">{progress}% Progress toward {nextBadge}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Section – Reward Box */}
        <div className="flex flex-row items-center border-1 border-b-3 border-blue-400 gap-8 px-9 rounded-lg">
          <div className="relative overflow-visible mb-4">
            <div className="flex flex-col items-center">
              <Image
                src="/ProfileGraphics/Gift.svg"
                alt="Gift icon"
                className="intersect:motion-preset-stretch-sm intersect-once"
                width={100}
                height={140}
              />
            </div>
          </div>

          <div className="py-4 mb:py-0">
            <p className="text-gray-600">
              Solve{" "}
              {(player?.milestone?.UnlockingLevel - player?.Level_Id < 0
                ? 0
                : player?.milestone?.UnlockingLevel - player?.Level_Id
              ).toString()}{" "}
              more level to get your reward
            </p>
            <p className="mb-4 font-semibold">
              {player?.milestone?.Milestone_Title}
            </p>
            <ProgressBar
              percentage={
                player?.milestone?.UnlockingLevel - player?.Level_Id < 0
                  ? 100
                  : (player?.Level_Id / player?.milestone?.UnlockingLevel) * 100
              }
            />
            <button
              className="quizPbtn mt-4"
              disabled={player?.Level_Id < player?.milestone?.UnlockingLevel}
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
