'use client'
import { Card } from '@/lib/types'
import { cn } from '@/lib/utils'

interface Props {
  card: Card
  isActive: boolean
  onClick: (cardId: number) => void
}

const TOPIC_BORDER_COLORS = [
  'border-blue-500 hover:border-blue-400',
  'border-purple-500 hover:border-purple-400',
  'border-amber-500 hover:border-amber-400',
  'border-emerald-500 hover:border-emerald-400',
]

const TOPIC_TEXT_COLORS = [
  'text-blue-400',
  'text-purple-400',
  'text-amber-400',
  'text-emerald-400',
]

export function CardTile({ card, isActive, onClick }: Props) {
  return (
    <button
      onClick={() => !card.completed && onClick(card.id)}
      disabled={card.completed}
      aria-label={card.completed ? `Card ${card.id} used` : `Card ${card.id}`}
      className={cn(
        'relative flex items-center justify-center rounded-xl border-2 aspect-square text-2xl font-bold transition-all duration-200 select-none',
        card.completed
          ? 'bg-zinc-900 border-zinc-800 text-zinc-700 cursor-not-allowed'
          : isActive
          ? 'bg-zinc-800 border-yellow-400 shadow-lg shadow-yellow-400/20 scale-105 ' + TOPIC_TEXT_COLORS[card.topicIndex]
          : cn(
              'bg-zinc-900 hover:bg-zinc-800 cursor-pointer hover:scale-105',
              TOPIC_BORDER_COLORS[card.topicIndex],
              TOPIC_TEXT_COLORS[card.topicIndex]
            )
      )}
    >
      {card.completed ? (
        <span className="text-zinc-700 text-xl">✓</span>
      ) : (
        <span>{card.id}</span>
      )}
    </button>
  )
}
