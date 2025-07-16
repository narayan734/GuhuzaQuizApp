// app/components/BadgeImage.tsx
"use client";
import Image from "next/image";

type BadgeImageProps = {
  badge: string; // e.g., "Amature", "Silver", etc.
   width?: number;
  height?: number;
};

export default function BadgeImage({ badge }: BadgeImageProps) {
  const fileName = badge.toLowerCase() + ".png";
  const path = `/badges/${fileName}`;

  return (
    <div className="text-center">
      <Image
        src={path}
        alt={`${badge} badge`}
        width={160}
        height={160}
        className="rounded"
      />
      
    </div>
  );
}
