import { db } from '.'
import { ReviewRecord } from './record'
import type { Word } from '@/typings'
import type { SrsGrade } from '@/utils/srs'
import { scheduleCard } from '@/utils/srs'
import Dexie from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'

/** Most words a single spaced-review session holds; the rest stay due for the next one. */
export const SRS_SESSION_SIZE = 50

/** Grades a word the user just typed (or skipped) and saves its next review date. */
export async function recordSrsResult(dict: string, word: Word, grade: SrsGrade) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { index, ...plainWord } = word as Word & { index?: number }
  try {
    await db.transaction('rw', db.srsCards, async () => {
      const card = await db.srsCards.get([dict, plainWord.name])
      const next = scheduleCard(card, grade, Date.now(), dict, plainWord)
      if (next) await db.srsCards.put(next)
    })
  } catch (e) {
    console.error(e)
  }
}

function dueRange(dict: string) {
  return db.srsCards.where('[dict+due]').between([dict, Dexie.minKey], [dict, Date.now()], true, true)
}

/** Words of `dict` that are due, most overdue first. */
export async function getDueWords(dict: string, limit = SRS_SESSION_SIZE): Promise<Word[]> {
  const cards = await dueRange(dict).limit(limit).toArray()
  return cards.map((card) => card.word)
}

/** A spaced-review session of the words due in `dict`, or undefined when none are. */
export async function createSpacedReviewRecord(dict: string) {
  const words = await getDueWords(dict)
  if (words.length === 0) return undefined
  const record = new ReviewRecord(dict, words)
  record.kind = 'srs'
  return record
}

export type SrsStats = { due: number; total: number; nextDue: number | undefined }

/** Live counts for `dict`: words due now, words scheduled at all, and when the next one falls due. */
export function useSrsStats(dict: string): SrsStats | undefined {
  return useLiveQuery(async () => {
    const [due, total, next] = await Promise.all([
      dueRange(dict).count(),
      db.srsCards.where('dict').equals(dict).count(),
      db.srsCards.where('[dict+due]').between([dict, Date.now()], [dict, Dexie.maxKey], false, true).first(),
    ])
    return { due, total, nextDue: next?.due }
  }, [dict])
}
