import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { playerId } = await req.json();

  if (!playerId) {
    return NextResponse.json({ error: 'Missing playerId' }, { status: 400 });
  }

  try {
    const currentPlayer = await prisma.player.findUnique({
      where: { Player_ID: playerId },
      select: { Playerpoint: true },
    });

    if (!currentPlayer) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    const rank = await prisma.player.count({
      where: {
        Playerpoint: { gt: currentPlayer.Playerpoint },
        NOT: { Player_ID: playerId },
      },
    }) + 1;

    return NextResponse.json({ rank });
  } catch (error) {
    console.error('Rank fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
