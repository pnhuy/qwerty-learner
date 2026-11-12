export * from './resource'

export type PronunciationType = 'us' | 'uk' | 'romaji' | 'zh' | 'ja' | 'de' | 'hapin' | 'kk' | 'id' | 'fi'
export type PhoneticType = 'us' | 'uk' | 'romaji' | 'zh' | 'ja' | 'de' | 'hapin' | 'kk' | 'id' | 'fi'
export type LanguageType = 'en' | 'romaji' | 'zh' | 'ja' | 'code' | 'de' | 'kk' | 'hapin' | 'id' | 'fi'
export type LanguageCategoryType = 'en' | 'ja' | 'de' | 'code' | 'kk' | 'id' | 'fi'

type Pronunciation2PhoneticMap = Record<PronunciationType, PhoneticType>

export const PRONUNCIATION_PHONETIC_MAP: Pronunciation2PhoneticMap = {
  us: 'us',
  uk: 'uk',
  romaji: 'romaji',
  zh: 'zh',
  ja: 'ja',
  de: 'de',
  hapin: 'hapin',
  kk: 'kk',
  id: 'id',
  fi: 'fi',
}

export type Word = {
  name: string
  trans: string[]
  usphone: string
  ukphone: string
  notation?: string
  /** Recording of the word (Finnish lists: Wikimedia Commons MP3); played instead of text-to-speech. */
  audio?: string
}

export type WordWithIndex = Word & {
  // original index within the chapter
  index: number
}

export type InfoPanelType = 'vsc'

export type InfoPanelState = {
  [key in InfoPanelType]: boolean
}

export type LoopWordTimesOption = 1 | 3 | 5 | 8 | typeof Number.MAX_SAFE_INTEGER

export type WordDictationType = 'hideAll' | 'hideVowel' | 'hideConsonant' | 'randomHide'
/**
 * Whether dictation mode was turned on manually by the user, or via the "dictate this chapter" button on the result screen
 *
 * Expected behaviour when moving to the next chapter: if dictation was turned on manually, keep it on;
 * if it was turned on via the result screen button, turn dictation mode off
 */
export type WordDictationOpenBy = 'user' | 'auto'
