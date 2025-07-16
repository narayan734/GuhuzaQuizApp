import React from "react";
import QuizList from "../components/quizList";
import fetchLevels from "@/utils/fLevels";
import { auth } from "@/auth";
import fetchUser from "@/utils/fUser";

type levelType = {
  Level_Id: number;
  Level_Title: string;
  Level_number: number;
};

type levelsType = levelType[];

async function AllQuiz() {
  const levels: levelsType = (await fetchLevels()) || [];
  const session = await auth();

  // Declare these up front
  let playerLevel = 1;
  let playerId = 0;

  // If session exists, fetch player info
  if (session) {
    const user = session.user;
    const name = user?.firstName == null ? "Anonymous" : user?.firstName;

    const player = await fetchUser(
      Number(user?.memberId),
      name,
      user?.email || ""
    );

    playerLevel = player?.Level_Id ?? 1;
    playerId = player?.Player_ID ?? 0;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="title mt-10" id="title">All Quiz</h1>
      <p className="mt-4 mb-20">Here are all the quiz levels you have unlocked</p>

      <QuizList
        allLevels={levels}
        cutEnding={false}
        playerLevel={playerLevel}
        playerId={playerId}
        showCurrentLevel={true}
      />
    </div>
  );
}

export default AllQuiz;
