'use client'
import { GameState } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface Props {
  state: GameState
  onExit: () => void
}

export function QuestionView({ state, onExit }: Props) {
  const activeCard = state.cards.find(c => c.id === state.activeCardId)
  if (!activeCard) return null

  const total = state.votes.myth + state.votes.reality
  const mythPct = total > 0 ? Math.round((state.votes.myth / total) * 100) : 0
  const realityPct = total > 0 ? Math.round((state.votes.reality / total) * 100) : 0
  const timerPct = (state.timer / 30) * 100
  const isResults = state.phase === 'results'

  return (
    <div className="fixed inset-0 bg-zinc-950/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 z-50">
      {/* Timer */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-zinc-400">
            {isResults ? 'Voting closed' : 'Time remaining'}
          </span>
          <span className={`font-bold tabular-nums ${state.timer <= 10 && !isResults ? 'text-red-400' : 'text-zinc-300'}`}>
            {isResults ? 'Done' : `${state.timer}s`}
          </span>
        </div>
        <Progress
          value={isResults ? 0 : timerPct}
          className={`h-3 transition-all ${state.timer <= 10 && !isResults ? '[&>div]:bg-red-500' : '[&>div]:bg-blue-500'}`}
        />
      </div>

      {/* Topic + question */}
      <div className="max-w-2xl text-center mb-10">
        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3 font-mono">
          {activeCard.topic} — Card {activeCard.id}
        </p>
        <h2 className="text-4xl font-bold leading-tight">{activeCard.question}</h2>
      </div>

      {/* Vote counts */}
      <div className="flex gap-20 mb-8">
        <div className="text-center">
          <p className="text-6xl font-black text-red-400 tabular-nums">{state.votes.myth}</p>
          <p className="text-sm text-zinc-400 mt-2 uppercase tracking-wide">Myth</p>
        </div>
        <div className="text-center">
          <p className="text-6xl font-black text-emerald-400 tabular-nums">{state.votes.reality}</p>
          <p className="text-sm text-zinc-400 mt-2 uppercase tracking-wide">Reality</p>
        </div>
      </div>

      {/* Results bar */}
      {isResults && total > 0 && (
        <div className="w-full max-w-2xl mb-8">
          <div className="flex rounded-full overflow-hidden h-10 text-sm font-bold">
            {mythPct > 0 && (
              <div
                style={{ width: `${mythPct}%` }}
                className="bg-red-500 flex items-center justify-center transition-all duration-500"
              >
                {mythPct}% Myth
              </div>
            )}
            {realityPct > 0 && (
              <div
                style={{ width: `${realityPct}%` }}
                className="bg-emerald-500 flex items-center justify-center transition-all duration-500"
              >
                {realityPct}% Reality
              </div>
            )}
          </div>
          <p className="text-center text-zinc-500 text-sm mt-2">{total} total votes</p>
        </div>
      )}

      {isResults && total === 0 && (
        <p className="text-zinc-500 mb-8">No votes were cast</p>
      )}

      <Button onClick={onExit} variant="outline" size="lg">
        ← Back to Board
      </Button>
    </div>
  )
}
