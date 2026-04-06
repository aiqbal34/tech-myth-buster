export interface Card {
  id: number
  topic: string
  question: string
  topicIndex: number
  cardIndex: number
  completed: boolean
}

export interface GameState {
  cards: Card[]
  activeCardId: number | null
  phase: 'board' | 'question' | 'results'
  votes: { myth: number; reality: number }
  timer: number
  timerActive: boolean
}
