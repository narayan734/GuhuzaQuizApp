import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getCookie, setCookie } from "cookies-next";

type typeUser = {
  userid: number;
  username: string | null;
  email: string;
};

const fetchUser = async (userid: number, username: string, email: string) => {
  const playerexist = await prisma.player.findFirst({
    where: {
      Player_ID: userid,
    },
  });

  if (playerexist) {
    const lastLoginDate = new Date(playerexist.lastLogin);
    lastLoginDate.setHours(0, 0, 0, 0);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const dayDiff = (currentDate.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24);
    let updatedStreak = playerexist.streak;

    if (dayDiff === 1) {
      updatedStreak += 1;
    } else if (dayDiff > 1) {
      updatedStreak = 1;
    }

    const tempScore = Number(getCookie("tempScore")) || 0;
    const totalScore = Number(playerexist.Playerpoint) + tempScore;

    const player = await prisma.player.update({
      where: {
        Player_ID: userid,
      },
      data: {
        Player_name: playerexist.Player_name.toLowerCase() === "anonymous" ? username : playerexist.Player_name,
        streak: updatedStreak,
        lastLogin: currentDate,
        Playerpoint: totalScore,
      },
      include: {
        milestones: true, // ✅ FIXED HERE
      },
    });

    setCookie("tempScore", "0");
    return player;
  } else {
    const player = await prisma.player.create({
      data: {
        Player_ID: Number(userid),
        Player_name: username,
        Playerpoint: 0,
        Level_Id: 1,
        lastLogin: new Date(),
        streak: 1,
      },
      include: {
        milestones: true, // ✅ FIXED HERE
      },
    });

    return player;
  }
};

export default fetchUser;
