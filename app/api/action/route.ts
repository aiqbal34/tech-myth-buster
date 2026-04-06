export const dynamic = 'force-dynamic'

import { flipCard, exitQuestion, resetGame } from '@/lib/gameState'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (body.type === 'FLIP_CARD' && typeof body.cardId === 'number') {
    flipCard(body.cardId)
    return Response.json({ ok: true })
  }
  if (body.type === 'EXIT_QUESTION') {
    exitQuestion()
    return Response.json({ ok: true })
  }
  if (body.type === 'RESET_GAME') {
    resetGame()
    return Response.json({ ok: true })
  }
  return Response.json({ ok: false, error: 'Unknown action' }, { status: 400 })
}
