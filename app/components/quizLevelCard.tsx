import Pbtn from "./buttons/primarybtn";
import StarRating from "./StarRating";


type QuizLevelCardTypes = {
  levelName: string;
  levelLink: string;
  levelNumber: number;
  currentLevel: number;
  correct?: number | null;
  total?: number | null;
};

function QuizLevelCard({
  levelName,
  levelLink,
  levelNumber,
  currentLevel,
  correct,
  total,
}: QuizLevelCardTypes) {
  return (
    <div
     className={` relative levelContainer bg-[#0a1a2f] text-white rounded-lg p-6 border border-white/10 shadow-md mt-10 lg:w-1/2 duration-300 lg:even:ml-auto hover:scale-[1.1] hover:shadow-lg transition-transform  ${levelNumber === 1 ? "mb-20" : ""}`}

    >
      {/* ⭐ Star rating top-right if score exists */}
      {correct != null && total != null && (
        <div className="absolute top-3 right-3 bg-white rounded-md px-2 py-1">
            <StarRating score={(correct / total) * 100} />
           </div>

      )}

      <div className="flex gap-4">
        <div className="flex items-center justify-center bg-blue-400 border-blue-400 text-[#191A23] w-8 h-8 rounded-full border-2 mb-4">
          <p className="font-bold">{levelNumber}</p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-2">{levelName}</h3>
          <p>Number of Questions: 10</p>

          {/* ✅ Show score if quiz attempted */}
          {correct !== null && total !== null && (
            <p className="text-green-600 font-semibold mt-1">
              ✅ Answer: {correct}/{total}
            </p>
          )}

          <div className="mt-4 flex gap-2">
            {correct !== null && total !== null && (
              <Pbtn message="Retry" toDestination={levelLink} />
            )}
            <Pbtn message="Start Quiz" toDestination={levelLink} />
          </div>
        </div>
      </div>
    </div>
   
  );
}

export default QuizLevelCard;
