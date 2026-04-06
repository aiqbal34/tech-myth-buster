'use client'
import { GameState } from '@/lib/types'
import { Button } from '@/components/ui/button'

interface Props {
  state: GameState
  myVote: 'myth' | 'reality' | null
  onVote: (vote: 'myth' | 'reality') => void
}

export function AudienceVote({ state, myVote, onVote }: Props) {
  // Waiting screen
  if (state.phase === 'board' || !state.activeCardId) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white gap-6 p-6">
        <div className="text-6xl">⏳</div>
        <h1 className="text-2xl font-bold text-center">Waiting for next question...</h1>
        <p className="text-zinc-400 text-center">The host will reveal a card on the big screen</p>
      </div>
    )
  }

  const activeCard = state.cards.find(c => c.id === state.activeCardId)
  if (!activeCard) return null

  const isOver = state.phase === 'results'
  const total = state.votes.myth + state.votes.reality
  const mythPct = total > 0 ? Math.round((state.votes.myth / total) * 100) : 0
  const realityPct = total > 0 ? Math.round((state.votes.reality / total) * 100) : 0

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 gap-8">
      {/* Timer */}
      <div className={`text-5xl font-black tabular-nums ${state.timer <= 10 && !isOver ? 'text-red-400' : 'text-zinc-300'}`}>
        {isOver ? '⏱ Time\'s up!' : `${state.timer}s`}
      </div>

      {/* Question */}
      <div className="text-center max-w-sm">
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2 font-mono">
          {activeCard.topic}
        </p>
        <h2 className="text-2xl font-bold leading-snug">{activeCard.question}</h2>
      </div>

      {/* Vote buttons */}
      {!myVote && !isOver ? (
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Button
            onClick={() => onVote('myth')}
            size="lg"
            className="h-16 text-xl font-bold bg-red-600 hover:bg-red-700 text-white border-0"
          >
            Myth
          </Button>
          <Button
            onClick={() => onVote('reality')}
            size="lg"
            className="h-16 text-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white border-0"
          >
            Reality
          </Button>
        </div>
      ) : (
        <div className="text-center flex flex-col items-center gap-6">
          {myVote && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-zinc-400">You voted</p>
              <span className={`text-3xl font-black ${myVote === 'myth' ? 'text-red-400' : 'text-emerald-400'}`}>
                {myVote === 'myth' ? 'Myth' : 'Reality'}
              </span>
            </div>
          )}
          {!myVote && isOver && (
            <p className="text-zinc-400">Voting has ended</p>
          )}

          {/* Results when over */}
          {isOver && total > 0 && (
            <div className="flex gap-10">
              <div className="text-center">
                <p className="text-4xl font-black text-red-400 tabular-nums">{state.votes.myth}</p>
                <p className="text-sm text-zinc-400 mt-1">{mythPct}% Myth</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black text-emerald-400 tabular-nums">{state.votes.reality}</p>
                <p className="text-sm text-zinc-400 mt-1">{realityPct}% Reality</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
