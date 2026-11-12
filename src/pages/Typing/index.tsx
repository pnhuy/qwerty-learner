import Layout from '../../components/Layout'
import { DictChapterButton } from './components/DictChapterButton'
import PronunciationSwitcher from './components/PronunciationSwitcher'
import ResultScreen from './components/ResultScreen'
import SpacedReviewButton from './components/SpacedReviewButton'
import Speed from './components/Speed'
import StartButton from './components/StartButton'
import Switcher from './components/Switcher'
import WordList from './components/WordList'
import WordPanel from './components/WordPanel'
import { useConfetti } from './hooks/useConfetti'
import { useWordList } from './hooks/useWordList'
import { TypingContext, TypingStateActionType, initialState, typingReducer } from './store'
import Header from '@/components/Header'
import Tooltip from '@/components/Tooltip'
import { idDictionaryMap } from '@/resources/dictionary'
import {
  currentChapterAtom,
  currentDictIdAtom,
  isReviewModeAtom,
  randomConfigAtom,
  reviewModeInfoAtom,
  saveDictProgressAtom,
} from '@/store'
import { IsDesktop, isLegal } from '@/utils'
import { useSaveChapterRecord } from '@/utils/db'
import { recordSrsResult } from '@/utils/db/srs'
import { useMixPanelChapterLogUploader } from '@/utils/mixpanel'
import { readDictProgress } from '@/utils/progress'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useImmerReducer } from 'use-immer'

const App: React.FC = () => {
  const [state, dispatch] = useImmerReducer(typingReducer, structuredClone(initialState))
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { words } = useWordList()

  const [currentDictId, setCurrentDictId] = useAtom(currentDictIdAtom)
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom)
  const saveDictProgress = useSetAtom(saveDictProgressAtom)
  const randomConfig = useAtomValue(randomConfigAtom)
  const chapterLogUploader = useMixPanelChapterLogUploader(state)
  const saveChapterRecord = useSaveChapterRecord()

  const reviewModeInfo = useAtomValue(reviewModeInfoAtom)
  const isReviewMode = useAtomValue(isReviewModeAtom)

  useEffect(() => {
    // Warn users on non-desktop devices
    if (!IsDesktop()) {
      setTimeout(() => {
        alert(
          'Qwerty Learner is designed to improve English typing for keyboard users and is not yet adapted for mobile devices. Please use a desktop browser. On a tablet such as an iPad, you can connect an external keyboard.',
        )
      }, 500)
    }
  }, [])

  // On mount and whenever currentDictId changes, fall back to the default dictionary if the current one no longer exists
  useEffect(() => {
    const id = currentDictId
    if (!(id in idDictionaryMap)) {
      setCurrentDictId('cet4')
      setCurrentChapter(0)
      return
    }
  }, [currentDictId, setCurrentChapter, setCurrentDictId])

  const skipWord = useCallback(() => {
    const word = state.chapterData.words[state.chapterData.index]
    // A skipped word counts as forgotten for spaced repetition
    if (word) recordSrsResult(currentDictId, word, 'again')
    dispatch({ type: TypingStateActionType.SKIP_WORD })
  }, [currentDictId, dispatch, state.chapterData.index, state.chapterData.words])

  useEffect(() => {
    const onBlur = () => {
      dispatch({ type: TypingStateActionType.SET_IS_TYPING, payload: false })
    }
    window.addEventListener('blur', onBlur)

    return () => {
      window.removeEventListener('blur', onBlur)
    }
  }, [dispatch])

  useEffect(() => {
    state.chapterData.words?.length > 0 ? setIsLoading(false) : setIsLoading(true)
  }, [state.chapterData.words])

  useEffect(() => {
    if (!state.isTyping) {
      const onKeyDown = (e: KeyboardEvent) => {
        if (!isLoading && e.key !== 'Enter' && (isLegal(e.key) || e.key === ' ') && !e.altKey && !e.ctrlKey && !e.metaKey) {
          e.preventDefault()
          dispatch({ type: TypingStateActionType.SET_IS_TYPING, payload: true })
        }
      }
      window.addEventListener('keydown', onKeyDown)

      return () => window.removeEventListener('keydown', onKeyDown)
    }
  }, [state.isTyping, isLoading, dispatch])

  useEffect(() => {
    if (words !== undefined) {
      let initialIndex = 0
      if (isReviewMode) {
        initialIndex = reviewModeInfo.reviewRecord?.index ?? 0
      } else if (!randomConfig.isOpen) {
        // Resume where the user stopped in this chapter
        const progress = readDictProgress(currentDictId)
        if (progress?.chapter === currentChapter) initialIndex = progress.index
      }

      dispatch({
        type: TypingStateActionType.SETUP_CHAPTER,
        payload: { words, shouldShuffle: randomConfig.isOpen, initialIndex },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words])

  useEffect(() => {
    // Remember where the user is. Only while typing (or on finishing), so the setup of a chapter, which can run with
    // default values before the stored settings are loaded, never overwrites saved progress.
    if (isReviewMode || !(state.isTyping || state.isFinished) || state.chapterData.words.length === 0) return
    if (state.isFinished) {
      const lastChapter = (idDictionaryMap[currentDictId]?.chapterCount ?? 1) - 1
      saveDictProgress({ dictId: currentDictId, progress: { chapter: Math.min(currentChapter + 1, lastChapter), index: 0 } })
    } else if (!randomConfig.isOpen) {
      saveDictProgress({ dictId: currentDictId, progress: { chapter: currentChapter, index: state.chapterData.index } })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.chapterData.index, state.isTyping, state.isFinished])

  useEffect(() => {
    // Once the chapter is finished and all word records are saved, save the chapter record
    if (state.isFinished && !state.isSavingRecord) {
      chapterLogUploader()
      saveChapterRecord(state)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isFinished, state.isSavingRecord])

  useEffect(() => {
    // Start the timer
    let intervalId: number
    if (state.isTyping) {
      intervalId = window.setInterval(() => {
        dispatch({ type: TypingStateActionType.TICK_TIMER })
      }, 1000)
    }
    return () => clearInterval(intervalId)
  }, [state.isTyping, dispatch])

  useConfetti(state.isFinished)

  return (
    <TypingContext.Provider value={{ state: state, dispatch }}>
      {state.isFinished && <ResultScreen />}
      <Layout>
        <Header>
          <DictChapterButton />
          <PronunciationSwitcher />
          <Switcher />
          <StartButton isLoading={isLoading} />
          <SpacedReviewButton />
          <Tooltip content="Skip this word">
            <button
              className={`${
                state.isShowSkip ? 'bg-orange-400' : 'invisible w-0 bg-gray-300 px-0 opacity-0'
              } my-btn-primary transition-all duration-300 `}
              onClick={skipWord}
            >
              Skip
            </button>
          </Tooltip>
        </Header>
        <div className="container mx-auto flex h-full flex-1 flex-col items-center justify-center pb-5">
          <div className="container relative mx-auto flex h-full flex-col items-center">
            <div className="container flex flex-grow items-center justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center ">
                  <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid  border-indigo-400 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                  ></div>
                </div>
              ) : (
                !state.isFinished && <WordPanel />
              )}
            </div>
            <Speed />
          </div>
        </div>
      </Layout>
      <WordList />
    </TypingContext.Provider>
  )
}

export default App
