'use client'
import { GameState } from '@/lib/types'
import { CardTile } from './CardTile'
import { QRCodeDisplay } from './QRCodeDisplay'

const TOPICS = ['Career & Success', 'Tech Skills', 'Startup Life', 'Work & Culture']
const TOPIC_HEADER_COLORS = [
  'bg-blue-900/40 text-blue-300 border border-blue-800',
  'bg-purple-900/40 text-purple-300 border border-purple-800',
  'bg-amber-900/40 text-amber-300 border border-amber-800',
  'bg-emerald-900/40 text-emerald-300 border border-emerald-800',
]

interface Props {
  state: GameState
  audienceUrl: string
  onCardClick: (cardId: number) => void
}

export function JeopardyBoard({ state, audienceUrl, onCardClick }: Props) {
  const completedCount = state.cards.filter(c => c.completed).length

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tech Myth Buster</h1>
          <p className="text-zinc-500 text-sm mt-1">{completedCount} / 20 cards revealed</p>
        </div>
        {audienceUrl && <QRCodeDisplay url={audienceUrl} />}
      </div>

      {/* Board */}
      <div className="grid grid-cols-4 gap-4 flex-1">
        {TOPICS.map((topic, topicIdx) => (
          <div key={topic} className="flex flex-col gap-3">
            <div className={`rounded-lg px-3 py-2 text-center text-sm font-semibold ${TOPIC_HEADER_COLORS[topicIdx]}`}>
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
