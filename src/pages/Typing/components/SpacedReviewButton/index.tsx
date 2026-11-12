import Tooltip from '@/components/Tooltip'
import { useStartSpacedReview } from '@/hooks/useReviewMode'
import { currentDictIdAtom, isReviewModeAtom } from '@/store'
import { useSrsStats } from '@/utils/db/srs'
import { useAtomValue } from 'jotai'
import IconRepeat from '~icons/tabler/repeat'

/** Header button that starts a spaced review of the current dictionary's due words. */
export default function SpacedReviewButton() {
  const dictId = useAtomValue(currentDictIdAtom)
  const isReviewMode = useAtomValue(isReviewModeAtom)
  const stats = useSrsStats(dictId)
  const startSpacedReview = useStartSpacedReview()

  if (isReviewMode || !stats || stats.total === 0) return null

  const due = stats.due
  const tooltip =
    due > 0
      ? `Spaced review: ${due} ${due === 1 ? 'word is' : 'words are'} due`
      : `Spaced review: nothing due${stats.nextDue ? ` until ${new Date(stats.nextDue).toLocaleDateString()}` : ''}`

  return (
    <Tooltip content={tooltip}>
      <button
        type="button"
        disabled={due === 0}
        onClick={() => startSpacedReview(dictId)}
        aria-label={tooltip}
        className="flex items-center gap-1 rounded-lg px-2 py-1 text-lg text-gray-500 transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white focus:outline-none disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-500 dark:text-gray-400 dark:hover:text-white dark:disabled:hover:text-gray-400"
      >
        <IconRepeat className="icon" />
        <span
          className={`min-w-[1.5rem] rounded-full px-1.5 text-sm ${due > 0 ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          {due}
        </span>
      </button>
    </Tooltip>
  )
}
