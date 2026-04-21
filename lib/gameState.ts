import { GameState, Card } from './types'

const INITIAL_CARDS: Card[] = [
  // AI & Future of Tech
  { id: 1,  topic: 'AI & Future of Tech', topicIndex: 0, cardIndex: 0, question: 'AI agents will replace most software engineers', completed: false },
  { id: 2,  topic: 'AI & Future of Tech', topicIndex: 0, cardIndex: 1, question: 'The barrier to entry for tech has gotten too low', completed: false },
  { id: 3,  topic: 'AI & Future of Tech', topicIndex: 0, cardIndex: 2, question: 'Anyone can become a developer in 6 months', completed: false },
  { id: 5,  topic: 'AI & Future of Tech', topicIndex: 0, cardIndex: 3, question: 'Building AI startups right now is more about speed than perfection', completed: false },
  { id: 6,  topic: 'AI & Future of Tech', topicIndex: 0, cardIndex: 4, question: 'Most of your day as a SWE is not coding', completed: false },
  // College & Breaking In
  { id: 7,  topic: 'College & Breaking In', topicIndex: 1, cardIndex: 0, question: 'Your GitHub matters more than your GPA', completed: false },
  { id: 8,  topic: 'College & Breaking In', topicIndex: 1, cardIndex: 1, question: 'Hackathons are a waste of time', completed: false },
  { id: 9,  topic: 'College & Breaking In', topicIndex: 1, cardIndex: 2, question: 'Your first internship is the hardest — after that it gets easier', completed: false },
  { id: 10, topic: 'College & Breaking In', topicIndex: 1, cardIndex: 3, question: 'College is not necessary for a successful tech career', completed: false },
  { id: 11, topic: 'College & Breaking In', topicIndex: 1, cardIndex: 4, question: 'Side projects used by thousands are better than internships', completed: false },
  // Careers & Industry Reality
  { id: 12, topic: 'Careers & Industry', topicIndex: 2, cardIndex: 0, question: 'Job security in tech is a myth', completed: false },
  { id: 13, topic: 'Careers & Industry', topicIndex: 2, cardIndex: 1, question: 'Most job descriptions are overrated', completed: false },
  { id: 14, topic: 'Careers & Industry', topicIndex: 2, cardIndex: 2, question: "Most resumes don't reflect actual skill", completed: false },
  { id: 15, topic: 'Careers & Industry', topicIndex: 2, cardIndex: 3, question: 'Your network is your biggest asset in tech', completed: false },
  { id: 16, topic: 'Careers & Industry', topicIndex: 2, cardIndex: 4, question: 'Switching jobs every 1–2 years is the best way to grow', completed: false },
  // Mindset & Growth
  { id: 17, topic: 'Mindset & Growth', topicIndex: 3, cardIndex: 0, question: 'Burnout is inevitable in tech', completed: false },
  { id: 18, topic: 'Mindset & Growth', topicIndex: 3, cardIndex: 1, question: 'Imposter syndrome never really goes away', completed: false },
  { id: 19, topic: 'Mindset & Growth', topicIndex: 3, cardIndex: 2, question: 'Luck plays a bigger role in success than people admit', completed: false },
  { id: 20, topic: 'Mindset & Growth', topicIndex: 3, cardIndex: 3, question: 'Working 9–5 limits your growth early in your career', completed: false },
  { id: 21, topic: 'Mindset & Growth', topicIndex: 3, cardIndex: 4, question: 'You should focus on one niche instead of trying everything', completed: false },
  { id: 22, topic: 'Mindset & Growth', topicIndex: 3, cardIndex: 5, question: "You're behind if you haven't started building by now", completed: false },
  // Startups vs Big Tech
  { id: 23, topic: 'Startups vs Big Tech', topicIndex: 4, cardIndex: 0, question: 'Startups are only for people who can take huge risks', completed: false },
  { id: 24, topic: 'Startups vs Big Tech', topicIndex: 4, cardIndex: 1, question: 'AI is making it too easy to start startups — leading to oversaturation', completed: false },
  { id: 25, topic: 'Startups vs Big Tech', topicIndex: 4, cardIndex: 2, question: 'Startups are becoming more attractive than big tech in 2026', completed: false },
  { id: 26, topic: 'Startups vs Big Tech', topicIndex: 4, cardIndex: 3, question: "You don't need FAANG to be successful", completed: false },
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

// Persist state across Next.js HMR reloads in development
const g = globalThis as typeof globalThis & {
  __gameState?: GameState
  __timerInterval?: ReturnType<typeof setInterval> | null
  __voterSet?: Set<string>
}
if (!g.__gameState) g.__gameState = freshState()
if (g.__timerInterval === undefined) g.__timerInterval = null
if (!g.__voterSet) g.__voterSet = new Set<string>()

function getGameState() { return g.__gameState! }
function setGameState(s: GameState) { g.__gameState = s }
function getTimerInterval() { return g.__timerInterval! }
function setTimerInterval(t: ReturnType<typeof setInterval> | null) { g.__timerInterval = t }
function getVoterSet() { return g.__voterSet! }

function clearTimer() {
  const t = getTimerInterval()
  if (t) {
    clearInterval(t)
    setTimerInterval(null)
  }
}

export function getState(): GameState {
  return getGameState()
}

export function flipCard(cardId: number): void {
  clearTimer()
  getVoterSet().clear()
  setGameState({
    ...getGameState(),
    activeCardId: cardId,
    phase: 'question',
    votes: { myth: 0, reality: 0 },
    timer: 30,
    timerActive: true,
  })
  setTimerInterval(setInterval(() => {
    const s = getGameState()
    if (s.timer <= 1) {
      clearTimer()
      setGameState({ ...s, timer: 0, timerActive: false, phase: 'results' })
    } else {
      setGameState({ ...s, timer: s.timer - 1 })
    }
  }, 1000))
}

export function exitQuestion(): void {
  clearTimer()
  const s = getGameState()
  setGameState({
    ...s,
    cards: s.cards.map(c =>
      c.id === s.activeCardId ? { ...c, completed: true } : c
    ),
    activeCardId: null,
    phase: 'board',
    timer: 30,
    timerActive: false,
    votes: { myth: 0, reality: 0 },
  })
}

export function resetGame(): void {
  clearTimer()
  getVoterSet().clear()
  setGameState(freshState())
}

export function submitVote(
  voterId: string,
  vote: 'myth' | 'reality'
): 'ok' | 'duplicate' | 'no_active' {
  const s = getGameState()
  if (s.phase !== 'question' && s.phase !== 'results') return 'no_active'
  if (s.phase === 'results') return 'no_active'
  if (getVoterSet().has(voterId)) return 'duplicate'
  getVoterSet().add(voterId)
  setGameState({
    ...s,
    votes: {
      ...s.votes,
      [vote]: s.votes[vote] + 1,
    },
  })
  return 'ok'
}
