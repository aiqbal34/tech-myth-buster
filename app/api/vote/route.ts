export const dynamic = 'force-dynamic'

import { submitVote } from '@/lib/gameState'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { voterId, vote } = body

  if (!voterId || !['myth', 'reality'].includes(vote)) {
    return Response.json({ ok: false, error: 'Invalid payload' }, { status: 400 })
  }

  const result = submitVote(voterId, vote)
  if (result === 'duplicate') {
    return Response.json({ ok: false, error: 'Already voted' }, { status: 409 })
  }
  if (result === 'no_active') {
    return Response.json({ ok: false, error: 'No active question' }, { status: 400 })
  }
  return Response.json({ ok: true })
}
