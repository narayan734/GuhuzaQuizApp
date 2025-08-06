"use client";
import React, { useEffect, useState } from "react";
import { FaTrophy, FaFire, FaUserPlus, FaStar, FaBolt } from "react-icons/fa";

type RewardItem = {
  id: number;
  title: string;
  description: string;
  type: "milestone" | "streak" | "referral" | "points" | "correctStreak";
  progress: number;
  claimable: boolean;
  claimed: boolean;
  rewardPoints: number;
};

type Props = {
  playerId: number;
};

const rewardIcons: Record<RewardItem["type"], JSX.Element> = {
  milestone: <FaTrophy className="text-yellow-500 text-lg mr-2" />,
  streak: <FaFire className="text-orange-500 text-lg mr-2" />,
  referral: <FaUserPlus className="text-pink-500 text-lg mr-2" />,
  points: <FaStar className="text-purple-500 text-lg mr-2" />,
  correctStreak: <FaBolt className="text-green-600 text-lg mr-2" />,
};

export default function RewardPage({ playerId }: Props) {
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showClaimed, setShowClaimed] = useState(false); // Toggle state

  useEffect(() => {
    const fetchRewards = async () => {
      const res = await fetch(`/api/reward?playerId=${playerId}`);
      const data = await res.json();

      const sorted = [...data].sort((a: RewardItem, b: RewardItem) => {
        if (a.claimed === b.claimed) return b.progress - a.progress;
        return a.claimed ? 1 : -1;
      });

      setRewards(sorted);
    };

    fetchRewards();
  }, [playerId]);

  const handleClaim = async (reward: RewardItem) => {
    if (!reward.claimable || reward.claimed) return;

    const res = await fetch("/api/reward", {
      method: "POST",
      body: JSON.stringify({ playerId, rewardId: reward.id }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setModalMessage(`🎉 You are awarded with ${reward.rewardPoints} points!`);
      setShowModal(true);

      // Update reward list locally
      setRewards((prev) =>
        [...prev.map((r) =>
          r.id === reward.id
            ? { ...r, claimed: true, claimable: false }
            : r
        )].sort((a, b) => {
          if (a.claimed === b.claimed) return b.progress - a.progress;
          return a.claimed ? 1 : -1;
        })
      );
    } else {
      const data = await res.json();
      alert(data.message || "⚠️ Unable to claim reward");
    }
  };

  // Filter rewards based on toggle state
  const displayedRewards = showClaimed
    ? rewards.filter((r) => r.claimed)
    : rewards.filter((r) => !r.claimed).slice(0, 10); // Only top 10 unclaimed

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Your Rewards Are Here
      </h1>

      {/* Toggle Button */}
      <div className="text-center mb-6">
        <button
          onClick={() => setShowClaimed(!showClaimed)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all"
        >
          {showClaimed ? "Show Unclaimed Rewards" : "Claimed Rewards"}
        </button>
      </div>

      {displayedRewards.length === 0 ? (
        <p className="text-center text-gray-500">
          {showClaimed ? "No claimed rewards found." : "No unclaimed rewards available."}
        </p>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {displayedRewards.map((reward) => (
            <div
              key={reward.id}
              className="relative border border-gray-200 p-6 rounded-2xl shadow-lg bg-white hover:bg-gray-50 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {rewardIcons[reward.type]}
                  <h2 className="text-lg font-semibold text-gray-800">{reward.title}</h2>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-600 uppercase font-medium">
                  {reward.type}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3">{reward.description}</p>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-green-500 h-3 transition-all duration-300"
                  style={{ width: `${reward.progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500">{reward.progress}% complete</p>

              {/* Claim button */}
              <div className="mt-0 text-right">
                <button
                  disabled={!reward.claimable || reward.claimed}
                  onClick={() => handleClaim(reward)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    reward.claimed
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : reward.claimable
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  {reward.claimed
                    ? "Claimed"
                    : reward.claimable
                    ? "Claim"
                    : "Not Available"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
            <p className="text-lg font-semibold text-gray-800 mb-4">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
