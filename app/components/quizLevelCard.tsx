import Pbtn from "./buttons/primarybtn";
import StarRating from "./StarRating";

type QuizLevelCardTypes = {
  levelName: string;
  levelLink: string;
  levelNumber: number;
  currentLevel: number;
  correct?: number | null;
  total?: number | null;
  score: number | null;
};

function QuizLevelCard({
  levelName,
  levelLink,
  levelNumber,
  currentLevel,
  correct,
  total,
  score,
}: QuizLevelCardTypes) {
  const isUnlocked = levelNumber <= currentLevel;
  const hasPlayed = correct !== null && total !== null && score !== null;

  return (
    <div className="bg-[#0a1a2f] text-white p-6 rounded-lg shadow-md w-full max-w-[420px] min-h-[240px] flex flex-col justify-between relative transition-transform duration-300 hover:scale-105 hover:shadow-[0_4px_20px_rgba(255,123,0,0.6)]">
      
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-blue-400 border-blue-400 text-[#191A23] w-10 h-10 rounded-full border-2">
            <p className="font-bold text-lg">{levelNumber}</p>
          </div>
          <h3 className="text-2xl font-semibold break-words">{levelName}</h3>
        </div>

        {hasPlayed && (
          <div className="bg-white rounded-md px-2 py-1">
            <StarRating score={(correct! / total!) * 100} />
          </div>
        )}
      </div>

      <p className="text-sm">Number of Questions: 10</p>

      {hasPlayed && (
        <p className="text-green-600 font-semibold mt-1 text-sm">
          ✅ Total Score: {score}
        </p>
      )}

      <div className="mt-4 flex gap-2">
        {isUnlocked ? (
          hasPlayed ? (
            <Pbtn
              message="Retry"
              toDestination={`${levelLink}?prevScore=${score}`}
            />
          ) : (
            <Pbtn message="Start Quiz" toDestination={levelLink} />
          )
        ) : (
          <p className="text-sm text-red-400 font-semibold mt-2">
            🔒 Locked
          </p>
        )}
      </div>
    </div>
  );
}

export default QuizLevelCard;
