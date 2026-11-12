/**
 * Usage-analytics hooks.
 *
 * The upstream project reported these events to the original author's Mixpanel
 * project. This fork does not ship any third-party analytics, so every function
 * here is a deliberate no-op. The call sites are kept so that a self-hosted
 * analytics backend can be plugged in at this single place if ever needed.
 */

/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */
import type { TypingState } from '@/pages/Typing/store/type'
import { useCallback } from 'react'

export type shareType = 'open' | 'download'
export function recordShareAction(_type: shareType) {}

export type analysisType = 'open'
export function recordAnalysisAction(_type: analysisType) {}

export type errorBookType = 'open' | 'detail'
export function recordErrorBookAction(_type: errorBookType) {}

export function recordDataAction(_info: { type: 'export' | 'import'; size: number; wordCount: number; chapterCount: number }) {}

export function useMixPanelChapterLogUploader(_typingState: TypingState) {
  return useCallback(() => {}, [])
}

/** Current UTC time as "YYYY-MM-DD HH:mm:ss" (also used for local word records). */
export function getUtcStringForMixpanel() {
  return new Date().toISOString().substring(0, 19).replace('T', ' ')
}
