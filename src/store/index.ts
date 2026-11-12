import atomForConfig from './atomForConfig'
import { reviewInfoAtom } from './reviewInfoAtom'
import { DISMISS_START_CARD_DATE_KEY, defaultFontSizeConfig } from '@/constants'
import { idDictionaryMap } from '@/resources/dictionary'
import { correctSoundResources, keySoundResources, wrongSoundResources } from '@/resources/soundResource'
import type {
  Dictionary,
  InfoPanelState,
  LoopWordTimesOption,
  PhoneticType,
  PronunciationTiming,
  PronunciationType,
  WordDictationOpenBy,
  WordDictationType,
} from '@/typings'
import type { ReviewRecord } from '@/utils/db/record'
import type { DictProgress, DictProgressMap } from '@/utils/progress'
import { DICT_PROGRESS_KEY, readDictProgressMap } from '@/utils/progress'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const currentDictIdAtom = atomWithStorage('currentDict', 'cet4')
export const currentDictInfoAtom = atom<Dictionary>((get) => {
  const id = get(currentDictIdAtom)
  let dict = idDictionaryMap[id]
  // Falls back to cet4 if the dict does not exist; the Typing page also resets an unknown DictId to cet4
  if (!dict) {
    dict = idDictionaryMap.cet4
  }
  return dict
})

export const currentChapterAtom = atomWithStorage('currentChapter', 0)

/** Where the user stopped in each dictionary (see utils/progress). */
export const dictProgressAtom = atomWithStorage<DictProgressMap>(DICT_PROGRESS_KEY, {})

/** Saves one dictionary's progress, merging with what localStorage holds so the other dictionaries are kept. */
export const saveDictProgressAtom = atom(
  null,
  (_get, set, { dictId, progress }: { dictId: string; progress: Omit<DictProgress, 'updatedAt'> }) => {
    const map = readDictProgressMap()
    const old = map[dictId]
    if (old && old.chapter === progress.chapter && old.index === progress.index) return
    set(dictProgressAtom, { ...map, [dictId]: { ...progress, updatedAt: Date.now() } })
  },
)

export const loopWordConfigAtom = atomForConfig<{ times: LoopWordTimesOption }>('loopWordConfig', {
  times: 1,
})

export const keySoundsConfigAtom = atomForConfig('keySoundsConfig', {
  isOpen: true,
  isOpenClickSound: true,
  volume: 1,
  resource: keySoundResources[0],
})

export const hintSoundsConfigAtom = atomForConfig('hintSoundsConfig', {
  isOpen: true,
  volume: 1,
  isOpenWrongSound: true,
  isOpenCorrectSound: true,
  wrongResource: wrongSoundResources[0],
  correctResource: correctSoundResources[0],
})

export const pronunciationConfigAtom = atomForConfig('pronunciation', {
  isOpen: true,
  volume: 1,
  type: 'us' as PronunciationType,
  name: 'American',
  isLoop: false,
  isTransRead: false,
  transVolume: 1,
  rate: 1,
  timing: 'appear' as PronunciationTiming,
})

export const fontSizeConfigAtom = atomForConfig('fontsize', defaultFontSizeConfig)

export const pronunciationIsOpenAtom = atom((get) => get(pronunciationConfigAtom).isOpen)

export const pronunciationIsTransReadAtom = atom((get) => get(pronunciationConfigAtom).isTransRead)

export const randomConfigAtom = atomForConfig('randomConfig', {
  isOpen: false,
})

export const isShowPrevAndNextWordAtom = atomWithStorage('isShowPrevAndNextWord', true)

export const isIgnoreCaseAtom = atomWithStorage('isIgnoreCase', true)

export const isShowAnswerOnHoverAtom = atomWithStorage('isShowAnswerOnHover', true)

export const isTextSelectableAtom = atomWithStorage('isTextSelectable', false)

export const reviewModeInfoAtom = reviewInfoAtom({
  isReviewMode: false,
  reviewRecord: undefined as ReviewRecord | undefined,
})
export const isReviewModeAtom = atom((get) => get(reviewModeInfoAtom).isReviewMode)
export const isSpacedReviewAtom = atom((get) => {
  const { isReviewMode, reviewRecord } = get(reviewModeInfoAtom)
  return isReviewMode && reviewRecord?.kind === 'srs'
})
export const reviewTitleAtom = atom((get) => (get(isSpacedReviewAtom) ? 'Spaced review' : 'Mistake review'))

export const phoneticConfigAtom = atomForConfig('phoneticConfig', {
  isOpen: true,
  type: 'us' as PhoneticType,
})

export const isOpenDarkModeAtom = atomWithStorage('isOpenDarkModeAtom', window.matchMedia('(prefers-color-scheme: dark)').matches)

export const isShowSkipAtom = atom(false)

export const isInDevModeAtom = atom(false)

export const infoPanelStateAtom = atom<InfoPanelState>({
  vsc: false,
})

export const wordDictationConfigAtom = atomForConfig('wordDictationConfig', {
  isOpen: false,
  type: 'hideAll' as WordDictationType,
  openBy: 'auto' as WordDictationOpenBy,
})

export const dismissStartCardDateAtom = atomWithStorage<Date | null>(DISMISS_START_CARD_DATE_KEY, null)

// Enhanced version promotion popup state
export const hasSeenEnhancedPromotionAtom = atomWithStorage('hasSeenEnhancedPromotion', false)

// for dev test
//   dismissStartCardDateAtom = atom<Date | null>(new Date())
