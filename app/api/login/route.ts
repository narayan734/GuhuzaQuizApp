// app/api/auth/autologin/route.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Step 1: Get the user with Username "Anonymous"
    const user = await prisma.user.findFirst({
      where: { Username: "Anonymous" },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Step 2: Get the corresponding player
    const player = await prisma.player.findFirst({
      where: { user_Id: user.User_Id },
    });

    if (!player) {
      return NextResponse.json({ message: "Player not found" }, { status: 404 });
    }

    // Step 3: Set session cookies and redirect
    const response = NextResponse.redirect(new URL("/quiz", req.url));

    response.cookies.set("LoggedIn", "true", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    response.cookies.set("PlayerLevel", String(player.Level_Id || 0), {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Auto-login error:", error);
    return NextResponse.json(
      { message: "Error during auto login", error },
      { status: 500 }
    );
  }
}
