import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const player = await prisma.player.findUnique({
    where: { Player_ID: id },
  });

  if (!player) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  return NextResponse.json(player);
}
