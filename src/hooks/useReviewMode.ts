import { currentChapterAtom, currentDictIdAtom, reviewModeInfoAtom } from '@/store'
import { createSpacedReviewRecord } from '@/utils/db/srs'
import { readDictProgress } from '@/utils/progress'
import { useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

/** Starts a spaced-review session of the words due in a dictionary. Resolves false when none are due. */
export function useStartSpacedReview() {
  const setCurrentDictId = useSetAtom(currentDictIdAtom)
  const setCurrentChapter = useSetAtom(currentChapterAtom)
  const setReviewModeInfo = useSetAtom(reviewModeInfoAtom)
  const navigate = useNavigate()

  return useCallback(
    async (dictId: string) => {
      const record = await createSpacedReviewRecord(dictId)
      if (!record) return false
      setCurrentDictId(dictId)
      // The chapter to come back to after the review
      setCurrentChapter(readDictProgress(dictId)?.chapter ?? 0)
      setReviewModeInfo({ isReviewMode: true, reviewRecord: record })
      navigate('/')
      return true
    },
    [navigate, setCurrentChapter, setCurrentDictId, setReviewModeInfo],
  )
}

/** Leaves review mode and returns to where the user stopped in the dictionary. */
export function useExitReviewMode() {
  const setCurrentChapter = useSetAtom(currentChapterAtom)
  const setReviewModeInfo = useSetAtom(reviewModeInfoAtom)

  return useCallback(
    (dictId: string) => {
      setCurrentChapter(readDictProgress(dictId)?.chapter ?? 0)
      setReviewModeInfo((old) => ({ ...old, isReviewMode: false }))
    },
    [setCurrentChapter, setReviewModeInfo],
  )
}
