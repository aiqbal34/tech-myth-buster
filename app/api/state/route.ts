export const dynamic = 'force-dynamic'

import { getState } from '@/lib/gameState'

export async function GET() {
  return Response.json(getState())
}
