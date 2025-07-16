import React, { Suspense } from "react";
import { auth } from "@/auth";
import fetchUser from "@/utils/fUser";
import fetchLevels from "@/utils/fLevels";
import QuizList from "../components/quizList";

export default async function QuizHistoryPage() {
  const session = await auth();
  const user = session?.user;
  

  if (!user) {
    return (
      <div className="text-center text-red-500 mt-10">
        You must be logged in to view your quiz history.
      </div>
    );
  }

  const player = await fetchUser(
    Number(user.memberId),
    user.firstName ?? "Anonymous",
    user.email ?? ""
  );

const levels = (await fetchLevels()) ?? [];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Your Quiz History</h1>

      <div className="grid lg:gap-16 gap-8">
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <QuizList
            allLevels={levels}
            playerLevel={player.Level_Id ?? 1}
            playerId={player.Player_ID}
            cutEnding={false}
            showOnlyPlayed={true}
          />
        </Suspense>
      </div>
    </div>
  );
}
