import Qbtn from "@/app/components/buttons/quizbtn";
import { fetchQuiz } from "@/utils/fQuiz";
import QuizCard from "@/app/components/quizCard";
import QuizPageSection from "@/app/components/quizPageSection";
import fetchLevels from "@/utils/fLevels";
import fetchPlayers from "@/utils/fPlayers";
import { auth } from "@/auth";
import fetchUser from "@/utils/fUser";

type quizeType = {
  question: string;
  comment: string;
  test_answer: number;
  answers: string[];
};
type quizesType = {
  question: quizeType[];
};

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string };
}) {

  const rawId = params.id;
  const levelId = params.id.split("?")[0]; // ✅ Clean it just in case

  console.log("🟡 RAW ID:", rawId);
console.log("🟢 FINAL LEVEL ID:", levelId);
  const prevScore = searchParams.prevScore ?? null;

  const data = await fetchQuiz(levelId);
  const Quizes = data.test.question;

  const levels = (await fetchLevels()) || [];
  const levelTitle = levels?.[Number(levelId) - 1]?.Level_Title;

  const session = await auth();
  const user = session?.user;
  const name = user?.firstName ?? "Anonymous";

  const player = session
    ? await fetchUser(Number(user?.memberId), name, user?.email || "")
    : {};

  return (
    <div>
      <QuizPageSection
        Quizes={Quizes}
        levelNumber={levelId}
        levelTitle={levelTitle}
        player={player}
        prevScore={prevScore}
      />
    </div>
  );
}
