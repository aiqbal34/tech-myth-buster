'use client'
import { GameState } from '@/lib/types'
import { CardTile } from './CardTile'
import { QRCodeDisplay } from './QRCodeDisplay'

const TOPICS = [
  'AI & Future of Tech',
  'College & Breaking In',
  'Careers & Industry',
  'Mindset & Growth',
  'Startups vs Big Tech',
]

const TOPIC_HEADER_COLORS = [
  'bg-violet-900/50 text-violet-200 border border-violet-700/60',
  'bg-sky-900/50 text-sky-200 border border-sky-700/60',
  'bg-amber-900/50 text-amber-200 border border-amber-700/60',
  'bg-emerald-900/50 text-emerald-200 border border-emerald-700/60',
  'bg-rose-900/50 text-rose-200 border border-rose-700/60',
]

interface Props {
  state: GameState
  audienceUrl: string
  onCardClick: (cardId: number) => void
}

export function JeopardyBoard({ state, audienceUrl, onCardClick }: Props) {
  const completedCount = state.cards.filter(c => c.completed).length
  const totalCount = state.cards.length

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Tech Myth Buster
          </h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            {completedCount} / {totalCount} cards revealed
          </p>
        </div>
        {audienceUrl && <QRCodeDisplay url={audienceUrl} />}
      </div>

      {/* Board */}
      <div className="grid grid-cols-5 gap-3 flex-1">
        {TOPICS.map((topic, topicIdx) => (
          <div key={topic} className="flex flex-col gap-2">
            <div className={`rounded-lg px-2 py-2.5 text-center text-xs font-bold leading-tight ${TOPIC_HEADER_COLORS[topicIdx]}`}>
              {topic}
            </div>
            {state.cards
              .filter(c => c.topicIndex === topicIdx)
              .sort((a, b) => a.cardIndex - b.cardIndex)
              .map(card => (
                <CardTile
                  key={card.id}
                  card={card}
                  isActive={state.activeCardId === card.id}
                  onClick={onCardClick}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}
