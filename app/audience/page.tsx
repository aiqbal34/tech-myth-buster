'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { GameState } from '@/lib/types'
import { AudienceVote } from '@/components/AudienceVote'

function getOrCreateVoterId(): string {
  const STORAGE_KEY = 'myth_buster_voter_id'
  let id = localStorage.getItem(STORAGE_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(STORAGE_KEY, id)
  }
  return id
}

export default function AudiencePage() {
  const [state, setState] = useState<GameState | null>(null)
  const [myVote, setMyVote] = useState<'myth' | 'reality' | null>(null)
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch('/api/state', { cache: 'no-store' })
      const data: GameState = await res.json()
      setState(prev => {
        // Reset vote when a new question becomes active
        if (data.activeCardId !== null && data.activeCardId !== prev?.activeCardId) {
          setMyVote(null)
        }
        return data
      })
    } catch (e) {
      console.error('State fetch failed', e)
    }
  }, [])

  useEffect(() => {
    fetchState()
    pollingRef.current = setInterval(fetchState, 1000)
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [fetchState])

  const handleVote = async (vote: 'myth' | 'reality') => {
    const voterId = getOrCreateVoterId()
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voterId, vote }),
      })
      if (res.ok) {
        setMyVote(vote)
      }
    } catch (e) {
      console.error('Vote failed', e)
    }
  }

  if (!state) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <div className="text-zinc-400">Connecting...</div>
      </div>
    )
  }

  return <AudienceVote state={state} myVote={myVote} onVote={handleVote} />
}
