import { CHAPTER_LENGTH } from '@/constants'
import { currentChapterAtom, currentDictInfoAtom, reviewModeInfoAtom } from '@/store'
import type { Word, WordWithIndex } from '@/typings/index'
import { wordListFetcher } from '@/utils/wordListFetcher'
import { useAtom, useAtomValue } from 'jotai'
import { useMemo } from 'react'
import useSWR from 'swr'

export type UseWordListResult = {
  words: WordWithIndex[]
  isLoading: boolean
  error: Error | undefined
}

/**
 * Use word lists from the current selected dictionary.
 */
export function useWordList(): UseWordListResult {
  const currentDictInfo = useAtomValue(currentDictInfoAtom)
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom)
  const { isReviewMode, reviewRecord } = useAtomValue(reviewModeInfoAtom)

  // Reset current chapter to 0, when currentChapter is greater than chapterCount.
  if (currentChapter >= currentDictInfo.chapterCount) {
    setCurrentChapter(0)
  }

  const isFirstChapter = !isReviewMode && currentDictInfo.id === 'cet4' && currentChapter === 0
  const { data: wordList, error, isLoading } = useSWR(currentDictInfo.url, wordListFetcher)

  const words: WordWithIndex[] = useMemo(() => {
    let newWords: Word[]
    if (isFirstChapter) {
      newWords = firstChapter
    } else if (isReviewMode) {
      newWords = reviewRecord?.words ?? []
    } else if (wordList) {
      newWords = wordList.slice(currentChapter * CHAPTER_LENGTH, (currentChapter + 1) * CHAPTER_LENGTH)
    } else {
      newWords = []
    }

    // Keep the original index and normalize word.trans to a string array
    return newWords.map((word, index) => {
      let trans: string[]
      if (Array.isArray(word.trans)) {
        trans = word.trans.filter((item) => typeof item === 'string')
      } else if (word.trans === null || word.trans === undefined || typeof word.trans === 'object') {
        trans = []
      } else {
        trans = [String(word.trans)]
      }
      return {
        ...word,
        index,
        trans,
      }
    })
  }, [isFirstChapter, isReviewMode, wordList, reviewRecord?.words, currentChapter])

  return { words, isLoading, error }
}

const firstChapter = [
  {
    name: 'cancel',
    trans: ['v. decide that something planned will not happen; remove or strike out'],
    usphone: "'kænsl",
    ukphone: "'kænsl",
  },
  {
    name: 'explosive',
    trans: ['adj. liable to explode; likely to cause strong feelings or argument', 'n. a substance that can explode'],
    usphone: "ɪk'splosɪv; ɪk'splozɪv",
    ukphone: "ɪk'spləusɪv",
  },
  { name: 'numerous', trans: ['adj. amounting to a large indefinite number'], usphone: "'numərəs", ukphone: "'njuːmərəs" },
  { name: 'govern', trans: ['v. exercise authority over; rule, control or direct'], usphone: "'ɡʌvɚn", ukphone: "'gʌvn" },
  { name: 'analyse', trans: ['v. examine in detail; break down into parts'], usphone: "'æn(ə)laɪz", ukphone: "'ænəlaɪz" },
  {
    name: 'discourage',
    trans: ['v. take away the confidence or enthusiasm of; try to prevent'],
    usphone: "dɪs'kɝɪdʒ",
    ukphone: "dɪs'kʌrɪdʒ",
  },
  { name: 'resemble', trans: ['v. look like or be similar to'], usphone: "rɪ'zɛmbl", ukphone: "rɪ'zembl" },
  {
    name: 'remote',
    trans: ['adj. far away in space or time; distant or aloof; very small (a remote chance); operated from a distance'],
    usphone: "rɪ'mot",
    ukphone: "rɪ'məut",
  },
  { name: 'salary', trans: ['n. a fixed regular payment for work, usually paid monthly'], usphone: "'sæləri", ukphone: "'sæləri" },
  {
    name: 'pollution',
    trans: ['n. making the environment dirty or harmful; a substance that does this'],
    usphone: "pə'luʃən",
    ukphone: "pə'luːʃn",
  },
  { name: 'pretend', trans: ['v. behave as if something is true when it is not'], usphone: "prɪ'tɛnd", ukphone: "prɪ'tend" },
  { name: 'kettle', trans: ['n. a container for boiling water'], usphone: "'kɛtl", ukphone: "'ketl" },
  {
    name: 'wreck',
    trans: ['n. a destroyed ship, car, etc.; a person in a bad physical or mental state', 'v. destroy or badly damage'],
    usphone: 'rɛk',
    ukphone: 'rek',
  },
  { name: 'drunk', trans: ['adj. affected by alcohol; overcome by a strong feeling'], usphone: 'drʌŋk', ukphone: 'drʌŋk' },
  { name: 'calculate', trans: ['v. work out using numbers; estimate; plan or intend'], usphone: "'kælkjulet", ukphone: "'kælkjuleɪt" },
  {
    name: 'persistent',
    trans: ['adj. refusing to give up; continuing for a long time or happening repeatedly'],
    usphone: "pə'zɪstənt",
    ukphone: "pə'sɪstənt",
  },
  { name: 'sake', trans: ['n. purpose or benefit (for the sake of); reason'], usphone: 'sek', ukphone: 'seɪk' },
  { name: 'conceal', trans: ['v. hide something or keep it secret'], usphone: "kən'sil", ukphone: "kən'siːl" },
  { name: 'audience', trans: ['n. the people watching, listening to or reading something'], usphone: "'ɔdɪəns", ukphone: "'ɔːdiəns" },
  { name: 'meanwhile', trans: ['adv. at the same time; in the meantime'], usphone: "'minwaɪl", ukphone: "'miːnwaɪl" },
]
