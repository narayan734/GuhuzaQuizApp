// components/StarRating.tsx
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function StarRating({ score }: { score: number }) {
  let stars = 0;
  if (score > 90) stars = 3;
  else if (score > 75) stars = 2.5;
  else if (score > 60) stars = 2;
  else if (score > 40) stars = 1.5;
  else if (score > 20) stars = 1;
  else stars = 0;

  const fullStars = Math.floor(stars);
  const halfStar = stars % 1 !== 0;
  const emptyStars = 3 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex gap-[2px] text-yellow-400 text-lg">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} />
      ))}
      {halfStar && <FaStarHalfAlt />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} />
      ))}
    </div>
  );
}
