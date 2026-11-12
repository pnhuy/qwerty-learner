/**
 * Spaced repetition scheduling (a variant of SM-2, the SuperMemo 2 algorithm that Anki also started from).
 *
 * Every word the user finishes typing is graded from its mistakes and gets a review date. A correct answer pushes the
 * next review further out (1 day, 3 days, then the previous interval times the word's ease); a failed one brings the
 * word back tomorrow and lowers its ease. Review dates fall on local midnight, so a word scheduled "in 1 day" is due
 * all of the next day, whatever time it was typed.
 */
import type { Word } from '@/typings'

export interface ISrsCard {
  dict: string
  /** The word's name; [dict+name] is the primary key. */
  name: string
  /** The word itself, so a review session can be built without loading the dictionary. */
  word: Word
  /** Successful reviews in a row. */
  reps: number
  /** Days until the next review. */
  interval: number
  /** Interval multiplier, at least MIN_EASE. */
  ease: number
  /** When the word is next due (ms, local midnight). */
  due: number
  /** How many times the word was forgotten after it had been learned. */
  lapses: number
  /** When the word was last graded (ms). */
  lastReview: number
}

export type SrsGrade = 'again' | 'hard' | 'good'

const INITIAL_EASE = 2.5
const MIN_EASE = 1.3

/** Typed with no mistakes: good. One mistake: hard. More, or skipped: forgotten. */
export function gradeFromWrongCount(wrongCount: number): SrsGrade {
  if (wrongCount === 0) return 'good'
  if (wrongCount === 1) return 'hard'
  return 'again'
}

export function startOfDay(ms: number) {
  const d = new Date(ms)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

function addDays(ms: number, days: number) {
  const d = new Date(ms)
  d.setDate(d.getDate() + days) // calendar days, so daylight-saving changes don't shift the time
  return d.getTime()
}

/**
 * Returns the card after grading it, or undefined when nothing changes: a word answered correctly before it is due
 * (extra practice, looping a word, repeating a chapter) keeps its schedule. A mistake always counts.
 */
export function scheduleCard(card: ISrsCard | undefined, grade: SrsGrade, now: number, dict: string, word: Word): ISrsCard | undefined {
  if (card && card.due > now && grade !== 'again') return undefined

  const prev: ISrsCard = card ?? {
    dict,
    name: word.name,
    word,
    reps: 0,
    interval: 0,
    ease: INITIAL_EASE,
    due: now,
    lapses: 0,
    lastReview: 0,
  }
  const next: ISrsCard = { ...prev, word, lastReview: now }

  if (grade === 'again') {
    next.reps = 0
    next.interval = 1
    next.ease = Math.max(MIN_EASE, prev.ease - 0.2)
    if (prev.reps > 0) next.lapses = prev.lapses + 1
  } else {
    next.reps = prev.reps + 1
    if (grade === 'hard') next.ease = Math.max(MIN_EASE, prev.ease - 0.15)
    if (next.reps === 1) {
      next.interval = 1
    } else if (next.reps === 2) {
      next.interval = grade === 'hard' ? 2 : 3
    } else {
      const factor = grade === 'hard' ? 1.2 : next.ease
      next.interval = Math.max(prev.interval + 1, Math.round(prev.interval * factor))
    }
  }

  next.due = addDays(startOfDay(now), next.interval)
  return next
}
