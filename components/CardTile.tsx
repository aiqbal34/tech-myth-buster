'use client'
import { Card } from '@/lib/types'
import { cn } from '@/lib/utils'

interface Props {
  card: Card
  isActive: boolean
  onClick: (cardId: number) => void
}

const TOPIC_COLORS = [
  { border: 'border-violet-500', hover: 'hover:border-violet-400', text: 'text-violet-300', glow: 'shadow-violet-500/20' },
  { border: 'border-sky-500',    hover: 'hover:border-sky-400',    text: 'text-sky-300',    glow: 'shadow-sky-500/20' },
  { border: 'border-amber-500',  hover: 'hover:border-amber-400',  text: 'text-amber-300',  glow: 'shadow-amber-500/20' },
  { border: 'border-emerald-500',hover: 'hover:border-emerald-400',text: 'text-emerald-300',glow: 'shadow-emerald-500/20' },
  { border: 'border-rose-500',   hover: 'hover:border-rose-400',   text: 'text-rose-300',   glow: 'shadow-rose-500/20' },
]

export function CardTile({ card, isActive, onClick }: Props) {
  const color = TOPIC_COLORS[card.topicIndex]

  return (
    <button
      onClick={() => !card.completed && onClick(card.id)}
      disabled={card.completed}
      aria-label={card.completed ? `Card ${card.id} done` : `Card ${card.id}`}
      className={cn(
        'relative flex items-center justify-center rounded-xl border-2 h-14 w-full text-xl font-bold transition-all duration-200 select-none',
        card.completed
          ? 'bg-zinc-900/40 border-zinc-800/50 text-zinc-700 cursor-not-allowed opacity-50'
          : isActive
          ? cn('bg-zinc-800 border-yellow-400 shadow-lg shadow-yellow-400/20 scale-105', color.text)
          : cn('bg-zinc-900 hover:bg-zinc-800 cursor-pointer hover:scale-105 hover:shadow-md', color.border, color.hover, color.text, color.glow)
      )}
    >
      {card.completed ? (
        <span className="text-zinc-600 text-base">✓</span>
      ) : (
        <span className="tabular-nums">{card.id}</span>
      )}
    </button>
  )
}
