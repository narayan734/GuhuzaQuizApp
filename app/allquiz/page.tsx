import React from "react";
import QuizAccordion from "../components/QuizAccordion";
import fetchLevels from "@/utils/fLevels";
import { auth } from "@/auth";
import fetchUser from "@/utils/fUser";

async function AllQuiz() {
  const levels = (await fetchLevels()) || [];
  const session = await auth();

  let playerLevel = 1;
  let playerId = 0;

  if (session) {
    const user = session.user;
    const name = user?.firstName ?? "Anonymous";
    const player = await fetchUser(Number(user?.memberId), name, user?.email || "");
    playerLevel = player?.Level_Id ?? 1;
    playerId = player?.Player_ID ?? 0;
  }

  return (
    <QuizAccordion
      allLevels={levels}
      playerLevel={playerLevel}
      playerId={playerId}
    />
  );
}

export default AllQuiz;
