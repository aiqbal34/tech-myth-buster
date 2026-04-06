import { GameState, Card } from './types'

const INITIAL_CARDS: Card[] = [
  // Career & Success
  { id: 1,  topic: 'Career & Success', topicIndex: 0, cardIndex: 0, question: 'You need a FAANG job to be successful', completed: false },
  { id: 2,  topic: 'Career & Success', topicIndex: 0, cardIndex: 1, question: 'A CS degree is required to become a software engineer', completed: false },
  { id: 3,  topic: 'Career & Success', topicIndex: 0, cardIndex: 2, question: 'Senior engineers write code all day', completed: false },
  { id: 4,  topic: 'Career & Success', topicIndex: 0, cardIndex: 3, question: 'You must specialize early to advance your career', completed: false },
  { id: 5,  topic: 'Career & Success', topicIndex: 0, cardIndex: 4, question: 'Networking is only for extroverts', completed: false },
  // Tech Skills
  { id: 6,  topic: 'Tech Skills', topicIndex: 1, cardIndex: 0, question: 'You need to know 10+ languages to be hireable', completed: false },
  { id: 7,  topic: 'Tech Skills', topicIndex: 1, cardIndex: 1, question: 'AI will replace all software engineers soon', completed: false },
  { id: 8,  topic: 'Tech Skills', topicIndex: 1, cardIndex: 2, question: 'Open source contributions are required for top jobs', completed: false },
  { id: 9,  topic: 'Tech Skills', topicIndex: 1, cardIndex: 3, question: 'Algorithms & data structures are used daily in industry', completed: false },
  { id: 10, topic: 'Tech Skills', topicIndex: 1, cardIndex: 4, question: 'You must use the latest tech stack to stay relevant', completed: false },
  // Startup Life
  { id: 11, topic: 'Startup Life', topicIndex: 2, cardIndex: 0, question: 'Startups always pay less than big tech', completed: false },
  { id: 12, topic: 'Startup Life', topicIndex: 2, cardIndex: 1, question: 'You need venture funding to build a successful product', completed: false },
  { id: 13, topic: 'Startup Life', topicIndex: 2, cardIndex: 2, question: 'Working at a startup means working 80 hours a week', completed: false },
  { id: 14, topic: 'Startup Life', topicIndex: 2, cardIndex: 3, question: 'Founding a startup right out of college is the best time', completed: false },
  { id: 15, topic: 'Startup Life', topicIndex: 2, cardIndex: 4, question: 'Most successful startups never pivot from their original idea', completed: false },
  // Work & Culture
  { id: 16, topic: 'Work & Culture', topicIndex: 3, cardIndex: 0, question: 'Remote work kills team culture', completed: false },
  { id: 17, topic: 'Work & Culture', topicIndex: 3, cardIndex: 1, question: 'Side projects are mandatory to get hired', completed: false },
  { id: 18, topic: 'Work & Culture', topicIndex: 3, cardIndex: 2, question: 'The best engineers are 10x more productive than average', completed: false },
  { id: 19, topic: 'Work & Culture', topicIndex: 3, cardIndex: 3, question: 'You need to be on social media to build a career in tech', completed: false },
  { id: 20, topic: 'Work & Culture', topicIndex: 3, cardIndex: 4, question: 'Work-life balance is impossible in the tech industry', completed: false },
]

function freshState(): GameState {
  return {
    cards: INITIAL_CARDS.map(c => ({ ...c })),
    activeCardId: null,
    phase: 'board',
    votes: { myth: 0, reality: 0 },
    timer: 30,
    timerActive: false,
  }
}

let gameState: GameState = freshState()
let timerInterval: ReturnType<typeof setInterval> | null = null
let voterSet = new Set<string>()

function clearTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

export function getState(): GameState {
  return gameState
}

export function flipCard(cardId: number): void {
  clearTimer()
  voterSet = new Set()
  gameState = {
    ...gameState,
    activeCardId: cardId,
    phase: 'question',
    votes: { myth: 0, reality: 0 },
    timer: 30,
    timerActive: true,
  }
  timerInterval = setInterval(() => {
    if (gameState.timer <= 1) {
      clearTimer()
      gameState = { ...gameState, timer: 0, timerActive: false, phase: 'results' }
    } else {
      gameState = { ...gameState, timer: gameState.timer - 1 }
    }
  }, 1000)
}

export function exitQuestion(): void {
  clearTimer()
  gameState = {
    ...gameState,
    cards: gameState.cards.map(c =>
      c.id === gameState.activeCardId ? { ...c, completed: true } : c
    ),
    activeCardId: null,
    phase: 'board',
    timer: 30,
    timerActive: false,
    votes: { myth: 0, reality: 0 },
  }
}

export function resetGame(): void {
  clearTimer()
  voterSet = new Set()
  gameState = freshState()
}

export function submitVote(
  voterId: string,
  vote: 'myth' | 'reality'
): 'ok' | 'duplicate' | 'no_active' {
  if (gameState.phase !== 'question' && gameState.phase !== 'results') return 'no_active'
  if (gameState.phase === 'results') return 'no_active'
  if (voterSet.has(voterId)) return 'duplicate'
  voterSet.add(voterId)
  gameState = {
    ...gameState,
    votes: {
      ...gameState.votes,
      [vote]: gameState.votes[vote] + 1,
    },
  }
  return 'ok'
}
