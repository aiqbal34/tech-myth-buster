'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { GameState } from '@/lib/types'
import { JeopardyBoard } from '@/components/JeopardyBoard'
import { QuestionView } from '@/components/QuestionView'
import { Button } from '@/components/ui/button'

export default function HostPage() {
  const [state, setState] = useState<GameState | null>(null)
  const [audienceUrl, setAudienceUrl] = useState('')
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setAudienceUrl(`${window.location.origin}/audience`)
  }, [])

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch('/api/state', { cache: 'no-store' })
      const data: GameState = await res.json()
      setState(data)
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

  const sendAction = useCallback(async (body: object) => {
    await fetch('/api/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    fetchState()
  }, [fetchState])

  const handleCardClick = (cardId: number) => sendAction({ type: 'FLIP_CARD', cardId })
  const handleExit = () => sendAction({ type: 'EXIT_QUESTION' })
  const handleReset = () => {
    if (confirm('Reset the entire game? All progress will be lost.')) {
      sendAction({ type: 'RESET_GAME' })
    }
  }

  if (!state) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <div className="text-zinc-400">Loading...</div>
      </div>
    )
  }

  return (
    <>
      {/* Reset button */}
      <div className="fixed top-4 left-4 z-50">
        <Button variant="destructive" size="sm" onClick={handleReset}>
          Reset Game
        </Button>
      </div>

      <JeopardyBoard
        state={state}
        audienceUrl={audienceUrl}
        onCardClick={handleCardClick}
      />

      {(state.phase === 'question' || state.phase === 'results') && (
        <QuestionView state={state} onExit={handleExit} />
      )}
    </>
  )
}
