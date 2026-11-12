/**
 * Where the user stopped in each dictionary, so practice resumes there instead of at the first word.
 *
 * Stored in localStorage under `dictProgress` as { [dictId]: DictProgress }. The Typing page reads it straight from
 * localStorage when it sets up a chapter: jotai's atomWithStorage only loads the stored value after mount, which is too
 * late for the first setup.
 */
export type DictProgress = {
  /** The chapter to open (after a chapter is finished, the next one). */
  chapter: number
  /** The first untyped word of that chapter. */
  index: number
  updatedAt: number
}

export type DictProgressMap = Record<string, DictProgress>

export const DICT_PROGRESS_KEY = 'dictProgress'

export function readDictProgressMap(): DictProgressMap {
  try {
    const raw = localStorage.getItem(DICT_PROGRESS_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function readDictProgress(dictId: string): DictProgress | undefined {
  return readDictProgressMap()[dictId]
}
