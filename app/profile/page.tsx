import React from "react";
import QuizLevelSections from "../components/quizLevelSections";
import LeaderBoard from "../components/leaderBoard";
import ProfileHerosection from "../components/profileHerosection";
import LeaderBoardSection from "../components/leaderBoardSection";
import { auth } from "@/auth";
import fetchUser from "@/utils/fUser";
import LoginButton from "../components/buttons/loginBtn";
import fetchRank from "@/utils/fRanking";
import ShareProfileBtn from "../components/buttons/shareprofileBtn";
import InviteFriendsBtn from "../components/buttons/inviteFriendsBtn";

async function Profile() {
  const session = await auth();

  if (session) {
    const user = session.user;
    const name = user?.firstName == null ? "Anonymous" : user?.firstName;

    const player = await fetchUser(
      Number(user?.memberId),
      name,
      user?.email || ""
    );

    const playerPoint: number = player ? player.Playerpoint : 0;
    const playerRank = player ? await fetchRank(playerPoint) : 100;
    const playerLevel = player?.Level_Id ?? 1;

    return (
      <div
        className="p-6 min-h-screen"
        style={{
          backgroundImage: "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
        }}
      >
        {/* Hero section with badge */}
        <ProfileHerosection player={player} playerRank={playerRank} />

        {/* Share Button and Invite*/}
        <div className="mt-6 flex justify-center gap-4">
  <ShareProfileBtn rank={playerRank} points={player.Playerpoint} />
  <InviteFriendsBtn playerId={player.Player_ID} />
</div>


        

        {/* Quiz Levels */}
        <div className="mt-12">
          <QuizLevelSections
            playerLevel={playerLevel}
            playerId={player.Player_ID}
          />
        </div>

        {/* Leaderboard */}
        <div className="mt-12 container">
          <LeaderBoardSection />
        </div>
      </div>
    );
  }

  // 🔒 Not Logged In
  return (
    <div className="flex h-full">
      <div className="px-8 my-32 rounded py-8 border-2 mx-auto w-fit bg-white">
        <div className="">
          <h1 className="title mb-5 w-32">Log in Required</h1>
          <p>You have to login in order to access this page</p>
          <div className="mt-5 w-full">
            <LoginButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
