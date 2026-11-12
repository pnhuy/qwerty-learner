import { pronunciationConfigAtom } from '@/store'
import type { PronunciationType } from '@/typings'
import { addHowlListener } from '@/utils'
import { romajiToHiragana } from '@/utils/kana'
import noop from '@/utils/noop'
import type { Howl } from 'howler'
import { useAtomValue } from 'jotai'
import { useEffect, useMemo, useState } from 'react'
import useSound from 'use-sound'
import type { HookOptions } from 'use-sound/dist/types'

const pronunciationApi = 'https://dict.youdao.com/dictvoice?audio='

// Unofficial Google Translate TTS, used for Finnish words without a Wiktionary recording (Youdao has no Finnish voice).
// It returns 404 when a Referer is sent, which is why index.html sets <meta name="referrer" content="no-referrer">.
const googleTtsApi = 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob'

/**
 * @param audio a recording URL stored on the word itself (Finnish lists: Wikimedia Commons via Wiktionary). It is
 *   preferred over the generated text-to-speech URL.
 */
export function generateWordSoundSrc(word: string, pronunciation: Exclude<PronunciationType, false>, audio?: string): string {
  if (audio) return audio
  switch (pronunciation) {
    case 'uk':
      return `${pronunciationApi}${word}&type=1`
    case 'us':
      return `${pronunciationApi}${word}&type=2`
    case 'romaji':
      return `${pronunciationApi}${romajiToHiragana(word)}&le=jap`
    case 'zh':
      return `${pronunciationApi}${word}&le=zh`
    case 'ja':
      return `${pronunciationApi}${word}&le=jap`
    case 'de':
      return `${pronunciationApi}${word}&le=de`
    case 'hapin':
    case 'kk':
      return `${pronunciationApi}${word}&le=ru` // Youdao does not support Kazakh; fall back to Russian pronunciation for now
    case 'id':
      return `${pronunciationApi}${word}&le=id`
    case 'fi':
      return `${googleTtsApi}&tl=fi&q=${encodeURIComponent(word)}`
    default:
      return ''
  }
}

export default function usePronunciationSound(word: string, isLoop?: boolean, audio?: string) {
  const pronunciationConfig = useAtomValue(pronunciationConfigAtom)
  const loop = useMemo(() => (typeof isLoop === 'boolean' ? isLoop : pronunciationConfig.isLoop), [isLoop, pronunciationConfig.isLoop])
  const [isPlaying, setIsPlaying] = useState(false)

  const [play, { stop, sound }] = useSound(generateWordSoundSrc(word, pronunciationConfig.type, audio), {
    html5: true,
    format: ['mp3'],
    loop,
    volume: pronunciationConfig.volume,
    rate: pronunciationConfig.rate,
  } as HookOptions)

  useEffect(() => {
    if (!sound) return
    sound.loop(loop)
    return noop
  }, [loop, sound])

  useEffect(() => {
    if (!sound) return
    const unListens: Array<() => void> = []

    unListens.push(addHowlListener(sound, 'play', () => setIsPlaying(true)))
    unListens.push(addHowlListener(sound, 'end', () => setIsPlaying(false)))
    unListens.push(addHowlListener(sound, 'pause', () => setIsPlaying(false)))
    unListens.push(addHowlListener(sound, 'playerror', () => setIsPlaying(false)))

    return () => {
      setIsPlaying(false)
      unListens.forEach((unListen) => unListen())
      ;(sound as Howl).unload()
    }
  }, [sound])

  return { play, stop, isPlaying }
}

export function usePrefetchPronunciationSound(word: string | undefined, audio?: string) {
  const pronunciationConfig = useAtomValue(pronunciationConfigAtom)

  useEffect(() => {
    if (!word) return

    const soundUrl = generateWordSoundSrc(word, pronunciationConfig.type, audio)
    if (soundUrl === '') return

    const head = document.head
    const isPrefetch = (Array.from(head.querySelectorAll('link[href]')) as HTMLLinkElement[]).some((el) => el.href === soundUrl)

    if (!isPrefetch) {
      const audioEl = new Audio()
      audioEl.src = soundUrl
      audioEl.preload = 'auto'

      // These two lines help avoid triggering download-manager extensions. Works locally without them, but kept as a safeguard for other extensions.
      // Google TTS sends no CORS headers, so a CORS-mode request would fail.
      if (!soundUrl.startsWith(googleTtsApi)) audioEl.crossOrigin = 'anonymous'
      audioEl.style.display = 'none'

      head.appendChild(audioEl)

      return () => {
        head.removeChild(audioEl)
      }
    }
  }, [pronunciationConfig.type, word, audio])
}
