import { useDeleteWordRecord } from '../../../utils/db'
import Chapter from '../Chapter'
import { ErrorTable } from '../ErrorTable'
import { getRowsFromErrorWordData } from '../ErrorTable/columns'
import { ReviewDetail } from '../ReviewDetail'
import useErrorWordData from '../hooks/useErrorWords'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useStartSpacedReview } from '@/hooks/useReviewMode'
import { currentChapterAtom, currentDictIdAtom, dictProgressAtom, reviewModeInfoAtom } from '@/store'
import type { Dictionary } from '@/typings'
import { useSrsStats } from '@/utils/db/srs'
import range from '@/utils/range'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import IcOutlineCollectionsBookmark from '~icons/ic/outline-collections-bookmark'
import MajesticonsPaperFoldTextLine from '~icons/majesticons/paper-fold-text-line'
import PajamasReviewList from '~icons/pajamas/review-list'

enum Tab {
  Chapters = 'chapters',
  Errors = 'errors',
  Review = 'review',
}

export default function DictDetail({ dictionary: dict }: { dictionary: Dictionary }) {
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom)
  const [currentDictId, setCurrentDictId] = useAtom(currentDictIdAtom)
  const [curTab, setCurTab] = useState<Tab>(Tab.Chapters)
  const setReviewModeInfo = useSetAtom(reviewModeInfoAtom)
  const navigate = useNavigate()
  const { deleteWordRecord } = useDeleteWordRecord()
  const [reload, setReload] = useState(false)

  const progress = useAtomValue(dictProgressAtom)[dict.id]
  const srsStats = useSrsStats(dict.id)
  const startSpacedReview = useStartSpacedReview()

  const chapter = useMemo(
    () => (dict.id === currentDictId ? currentChapter : progress?.chapter ?? 0),
    [currentChapter, currentDictId, dict.id, progress?.chapter],
  )
  const { errorWordData, isLoading, error } = useErrorWordData(dict, reload)

  const tableData = useMemo(() => {
    return getRowsFromErrorWordData(errorWordData)
  }, [errorWordData])

  const onDelete = useCallback(
    async (word: string) => {
      await deleteWordRecord(word, dict.id)
      setReload((old) => !old)
    },
    [deleteWordRecord, dict.id],
  )

  const onChangeChapter = useCallback(
    (index: number) => {
      setCurrentDictId(dict.id)
      setCurrentChapter(index)
      setReviewModeInfo((old) => ({ ...old, isReviewMode: false }))
      navigate('/')
    },
    [dict.id, navigate, setCurrentChapter, setCurrentDictId, setReviewModeInfo],
  )

  const handleTabChange = useCallback(
    (value: Tab) => {
      if (value !== curTab) {
        setCurTab(value)
      }
    },
    [curTab],
  )

  return (
    <div className="flex flex-col rounded-[4rem] px-4 py-3 pl-5 text-gray-800 dark:text-gray-300">
      <div className="flex min-h-[10rem] items-end justify-between gap-6 pb-5">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h3 className="text-2xl font-semibold">{dict.name}</h3>
          <p className="mt-1">{dict.chapterCount} chapters</p>
          <p>{dict.length} words in total</p>
          <p>{dict.description}</p>
        </div>
        <div className="mr-4 shrink-0">
          <ToggleGroup type="single" value={curTab} onValueChange={handleTabChange}>
            <ToggleGroupItem
              value={Tab.Chapters}
              disabled={curTab === Tab.Chapters}
              className={`${curTab === Tab.Chapters ? 'text-primary-foreground bg-primary' : ''} disabled:opacity-100`}
            >
              <MajesticonsPaperFoldTextLine className="mr-1.5 text-gray-500" />
              Chapters
            </ToggleGroupItem>
            {errorWordData.length > 0 && (
              <>
                <ToggleGroupItem
                  value={Tab.Errors}
                  disabled={curTab === Tab.Errors}
                  className={`${curTab === Tab.Errors ? 'text-primary-foreground bg-primary' : ''} disabled:opacity-100`}
                >
                  <IcOutlineCollectionsBookmark className="mr-1.5 text-gray-500" />
                  View mistakes
                </ToggleGroupItem>
                <ToggleGroupItem
                  value={Tab.Review}
                  disabled={curTab === Tab.Review}
                  className={`${curTab === Tab.Review ? 'text-primary-foreground bg-primary' : ''} disabled:opacity-100`}
                >
                  <PajamasReviewList className="mr-1.5 text-gray-500" />
                  Review mistakes
                </ToggleGroupItem>
              </>
            )}
          </ToggleGroup>
        </div>
      </div>
      <div className="flex pl-0">
        <Tabs value={curTab} className="h-[30rem] w-full ">
          <TabsContent value={Tab.Chapters} className="h-full ">
            <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl bg-indigo-50 px-4 py-3 text-sm dark:bg-gray-700">
              <div className="flex items-center gap-3">
                <span>
                  {progress
                    ? `Last stopped at chapter ${progress.chapter + 1}${progress.index > 0 ? `, word ${progress.index + 1}` : ''}`
                    : 'Not started yet'}
                </span>
                {progress && (
                  <Button size="sm" onClick={() => onChangeChapter(progress.chapter)}>
                    Continue
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span>
                  {srsStats && srsStats.total > 0
                    ? `Spaced review: ${srsStats.due} of ${srsStats.total} learned ${srsStats.total === 1 ? 'word' : 'words'} due`
                    : 'Words you type are scheduled for spaced review'}
                </span>
                {srsStats && srsStats.total > 0 && (
                  <Button size="sm" disabled={srsStats.due === 0} onClick={() => startSpacedReview(dict.id)}>
                    Start spaced review
                  </Button>
                )}
              </div>
            </div>
            <ScrollArea className="h-[26rem] ">
              <div className="flex w-full flex-wrap gap-3">
                {range(0, dict.chapterCount, 1).map((index) => (
                  <Chapter
                    key={`${dict.id}-${index}`}
                    index={index}
                    checked={chapter === index}
                    dictID={dict.id}
                    onChange={onChangeChapter}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value={Tab.Errors} className="h-full">
            <ErrorTable data={tableData} isLoading={isLoading} error={error} onDelete={onDelete} />
          </TabsContent>
          <TabsContent value={Tab.Review} className="h-full">
            <ReviewDetail errorData={errorWordData} dict={dict} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
