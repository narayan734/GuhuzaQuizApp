import { auth } from "@/auth";
import fetchPlayers from "@/utils/fPlayers";
import fetchRank from "@/utils/fRanking";
import fetchUser from "@/utils/fUser";

type leaderBoardType = {
  player: number;
  friends: Array<number>;
};

type milestoneType = {
  Milestone_Id: number;
  Milestone_Title: string;
  Milestone_description: string;
  UnlockingLevel: number;
  UploadRequired: boolean;
};

type playerType = {
  Player_ID: number;
  Player_name: string;
  Playerpoint: number;
  streak: number;
  lastLogin: Date;
  Level_Id?: number;
  Milestone_Id?: number;
  milestone: milestoneType;
  badge?: string;
};

type PlayersType = { Players: playerType[] | [] };

export default async function LeaderBoard() {
  const Players = (await fetchPlayers()) || [];
  const session = await auth();
 const user = session?.user;
  const name = user?.firstName == null ? "Anonymous" :user?.firstName + " " + user?.lastName

  const player = session ? await fetchUser(
    Number(user?.memberId),
    name,
    user?.email || ""
  ) : null
  const playerId =session ?  player?.Player_ID : null ;
 const rank = player ?  await fetchRank(player.Playerpoint) : 100 
  // Sort players by points in descending order
  const sortedPlayers = [...Players]?.sort(
    (a, b) => b?.Playerpoint - a?.Playerpoint
  );
  // Get the top 5 players
  let topPlayers = sortedPlayers;

  // Check if the current player is in the top 5
  
  const isPlayerInTop5 = topPlayers?.some((p) => p?.Player_ID === playerId);

  // If the current player is not in the top 5, add them to the table
  if (!isPlayerInTop5) {
    const currentPlayer = Players?.find((p) => p?.Player_ID === playerId);
    if (currentPlayer) {
      topPlayers.push(currentPlayer); // Replace the 5th player with the current player
    }
  }


  return (
    <div className=" py-24">
      <div className="container">
        <h2 className="px-4 py-1 text-center bg-blue-400 text-4xl w-fit rounded font-bold text-gray-900 m-auto intersect:motion-preset-slide-up motion-delay-200 intersect-once ">
          LeaderBoard
        </h2>
      
        <p className="w-96 m-auto text-center mt-6 mb-10 intersect:motion-preset-slide-up motion-delay-200 intersect-once">
          Check our top performers
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="intersect:motion-preset-slide-up motion-delay-200 intersect-once min-w-full bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
  <thead className="bg-gradient-to-b from-gray-950 to-gray-800 text-white uppercase text-base font-bold">
    <tr>
      <th className="px-6 py-4 text-left tracking-wider">Ranking</th>
      <th className="px-6 py-4 text-left tracking-wider">Name</th>
      <th className="px-6 py-4 text-left tracking-wider">Points</th>
      <th className="px-6 py-4 text-left tracking-wider">Level</th>
      <th className="px-6 py-4 text-left tracking-wider">Badge</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-300 text-gray-800 text-base font-medium">
    {topPlayers.map((playerData, index) => {
      const isCurrentPlayer = playerData?.Player_ID === playerId;
      const leaderBoardRank = isCurrentPlayer ? rank : index + 1;
      const rowClass = isCurrentPlayer ? "bg-blue-100 font-semibold text-gray-900" : "";

      return (
        <tr
          key={playerData?.Player_ID}
          className={`${rowClass} transition-all hover:bg-gray-100`}
        >
          <td className="px-6 py-4">
  {index === 0 ? (
    <span className="text-5xl">🥇</span>
  ) : index === 1 ? (
    <span className="text-5xl">🥈</span>
  ) : index === 2 ? (
    <span className="text-5xl">🥉</span>
  ) : (
    <span className="text-base  text-5xl">{leaderBoardRank}</span>
  )}
</td>

          <td className="px-6 py-4 text-5x1">{playerData?.Player_name}</td>
          <td className="px-6 py-4">{playerData?.Playerpoint}</td>
          <td className="px-6 py-4">{playerData?.Level_Id}</td>
          <td className="px-6 py-4">{playerData?.badge}</td>
        </tr>
      );
    })}
  </tbody>
</table>

      </div>
    </div>
  );
}
