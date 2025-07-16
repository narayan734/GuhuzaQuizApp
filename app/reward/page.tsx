import RewardCopy from "../components/rewardcopy";
import React from "react";
import { auth } from "@/auth";
import fetchUser from "@/utils/fUser";

async function Reward() {
  const session = await auth();

  if (!session) {
    return (
      <div className="p-6 text-red-500">
        You must be logged in to view your rewards.
      </div>
    );
  }

  const user = session.user;
  const player = await fetchUser(
    Number(user?.memberId),
    user?.firstName || "Anonymous",
    user?.email || "noemailavailable"
  );

  if (!player) {
    return (
      <div className="p-6 text-red-500">
        Could not load player info.
      </div>
    );
  }

  return (
    <div className="p-6">
      <RewardCopy playerId={player.Player_ID} />
    </div>
  );
}

export default Reward;
