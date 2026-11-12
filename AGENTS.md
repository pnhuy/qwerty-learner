# AGENTS.md

Guidance for AI coding agents (and humans) working in this repository.

## What this is

**Qwerty Learner (English edition)** — a browser app for memorising vocabulary by typing it. A word's definition is
shown, the user types the word, and typos, speed (WPM) and accuracy are tracked per word and per chapter. It also
covers programming keywords/APIs, Japanese (romaji), German, Kazakh, Indonesian and Finnish word lists.

This fork is a full English port of [RealKai42/qwerty-learner](https://github.com/RealKai42/qwerty-learner) (GPL-3.0):

- The UI is English only.
- Word definitions in every English-language dictionary come from **Princeton WordNet 3.0**, with Webster's 1913
  (public domain) and a hand-written supplement as fallbacks. Entries without an English source keep their original
  Chinese definitions, as do the dictionaries that have no English source at all (programming, Japanese, Kazakh,
  Indonesian).
- China-specific promotion (WeChat/RedBook QR codes, Alipay donations, the ICP filing, friend links) and third-party
  analytics (Mixpanel, Vercel) were removed. `src/utils/mixpanel.ts` is a no-op stub that keeps the call sites in place.

Everything runs client-side. There is no backend: dictionaries are static JSON in `public/dicts`, settings live in
`localStorage`, and practice history lives in IndexedDB.

## Stack

React 18 + TypeScript (strict) · Vite 4 · jotai (state) · use-immer (Typing page reducer) · Tailwind CSS
(+ headlessui, radix-ui, shadcn-style `components/ui`) · Dexie (IndexedDB) · SWR (dictionary fetching) · howler /
use-sound (audio) · echarts (analysis) · unplugin-icons (`~icons/<collection>/<name>`) · Playwright (e2e) · Tauri
(optional desktop shell in `src-tauri/`).

## Commands

```bash
yarn install
yarn dev          # Vite dev server
yarn build        # production build to ./build (base ./)
yarn lint         # eslint .
yarn prettier     # prettier --write .
yarn test:e2e     # Playwright tests in tests/
npx tsc --noEmit  # type-check (there is no dedicated script)
```

A Husky pre-commit hook runs lint-staged, `eslint --fix` and `prettier --write`.

## Layout

```
src/
  index.tsx              Router: / (Typing), /gallery, /analysis, /error-book, /mobile
  pages/
    Typing/              Main practice page. Local state = useImmerReducer(typingReducer) in store/,
                         shared through TypingContext. components/WordPanel is the typing core.
    Gallery-N/           Dictionary picker (categories, tags, chapters, error review)
    Analysis/            Heatmap and charts from IndexedDB records
    ErrorBook/           Words the user got wrong, across dictionaries
    Mobile/              Landing page for narrow screens (the app is desktop-only)
  store/index.ts         Global jotai atoms. atomForConfig() = atomWithStorage + schema back-fill
  resources/
    dictionary.ts        Catalogue of every dictionary (id, name, description, category, tags, url, length,
                         language, languageCategory)
    soundResource.ts     Key/correct/wrong sounds and pronunciation options
  utils/db/              Dexie RecordDB (wordRecords, chapterRecords, reviewRecords, srsCards) and hooks that save them
  utils/srs.ts           Spaced-repetition scheduler; utils/progress.ts = per-dictionary resume point
  utils/mixpanel.ts      Analytics no-op stubs
  typings/               Shared types (Word, Dictionary, LanguageType, ...)
  components/            Shared UI (Header, Footer, InfoPanel, Tooltip, ui/ = shadcn primitives)
public/dicts/*.json      Word lists
scripts/english-definitions/   Generator that fills in English definitions (see below)
scripts/finnish/         Builds the levelled Finnish lists (see below)
docs/                    Upstream docs (toBuildDict.md = how to add a dictionary)
```

## Dictionaries

A word list is a JSON array:

```json
[
  {
    "name": "cancel",
    "trans": ["v. postpone indefinitely or annul something that was scheduled"],
    "usphone": "'kænsl",
    "ukphone": "'kænsl"
  }
]
```

`trans` holds one string per part of speech, prefixed `n.` / `v.` / `adj.` / `adv.` / `prep.` ... Optional fields are
`notation` (Japanese furigana) and `pron`. Each list must also be registered in `src/resources/dictionary.ts`.
`length` must equal the number of words, because chapters are computed from it (20 words per chapter).

### Regenerating English definitions

`scripts/english-definitions/generate.py` rewrites `trans` for dictionaries whose `language` and `languageCategory`
are both `'en'`. Sources, in priority order:

1. `supplement.json`: hand-written definitions for function words, phrases and modern words.
2. WordNet. Senses are ranked by frequency, with at most 2 senses per part of speech and 3 parts of speech per word.
   The `n.`/`v.`/... hints already in `trans` choose the parts of speech.
3. Webster 1913, for single lower-case words only.
4. The original translation, if nothing else matches.

The script is idempotent. It writes words that still have Chinese definitions to `untranslated.txt`, which shows where
`supplement.json` needs entries. The docstring has the setup steps (venv + `nltk`, the WordNet corpus, the Webster
JSON download). After you add a new English dictionary or extend `supplement.json`, re-run it and review the
`git diff`.

### Finnish word lists

`public/dicts/finnish_level_1..5.json` are generated by `scripts/finnish/build.py` (setup steps are in its docstring)
from two CC BY-SA 4.0 sources:

- English Wiktionary's Finnish entries, through wiktextract/kaikki.org, for lemmas, parts of speech and English glosses.
- Hermit Dave's FrequencyWords, built from OpenSubtitles 2018, for frequencies.

Inflected forms are credited to their lemmas, and the ranked lemmas are cut into five frequency bands (1–500, –1500,
–3000, –5000, –8000). The bands roughly match CEFR A1–C1, but they are not an official list. Because the corpus is
subtitles, it has a slight bias towards film vocabulary. When typing Finnish, `a`/`o` are accepted for `ä`/`ö`/`å`;
see `isCharMatch` in `src/utils`.

Pronunciation: Youdao has no Finnish voice. About 470 words have a human recording on Wikimedia Commons, which
`scripts/finnish/commons_audio.py` collects. Those words carry the MP3 link in an optional `audio` field, which
`generateWordSoundSrc` plays first. Other Finnish words use Google Translate's unofficial TTS endpoint. That endpoint
returns 404 if a Referer is sent, so `index.html` sets `<meta name="referrer" content="no-referrer">`. Keep that tag.

## Progress and spaced repetition

- **Progress.** `dictProgress` in localStorage (`src/utils/progress.ts`, `dictProgressAtom` / `saveDictProgressAtom`)
  holds `{ chapter, index }` per dictionary. The Typing page saves it while the user types (never during chapter setup,
  which can run with defaults before jotai loads stored values), skips the index while shuffle is on, and on finishing
  a chapter points it at the next one. Setting up a chapter resumes at the saved index when the chapter matches. The
  Gallery's chapter panel has a "Continue" button, and leaving a review returns to the saved chapter.
- **Spaced repetition.** `src/utils/srs.ts` is an SM-2 variant. Every finished word is graded from its mistakes (0 →
  good, 1 → hard, 2+ or skipped → again) and stored in the Dexie `srsCards` table (`[dict+name]`, version 4) with a due
  date on local midnight. A correct answer before the due date doesn't change the schedule. Due words (up to 50) form
  a review session: a `ReviewRecord` with `kind: 'srs'` that lives only in the `reviewModeInfo` localStorage key, never
  in `reviewRecords`. It is started from the header's repeat button or from the Gallery, and `reviewTitleAtom` labels
  it "Spaced review" instead of "Mistake review".

## Coding principles

- **TypeScript strict.** No `any` without a reason; prefer `import type` for types. Use the `@/` alias for `src/`.
- **Formatting is automated.** Prettier: no semicolons, single quotes, trailing commas, 140-column lines. Imports are
  sorted by `@trivago/prettier-plugin-sort-imports` and Tailwind classes by `prettier-plugin-tailwindcss`. Run
  `yarn prettier` and `yarn lint` rather than hand-formatting.
- **State.**
  - App-wide settings are jotai atoms in `src/store`, and anything persisted goes through `atomForConfig`.
  - Per-session typing state stays in the Typing reducer, which you change by dispatching `TypingStateActionType`
    actions.
  - Don't add another state library.
- **Never break persisted data.**
  - `localStorage` keys (`currentDict`, `pronunciation`, `wordDictationConfig`, ...), their value shapes, and the
    Dexie schema are user data.
  - To add a config field, add it to the default value; `atomForConfig` back-fills it.
  - To change the IndexedDB schema, add a new `this.version(n)` and don't edit old ones.
- **Styling.**
  - Use Tailwind utility classes with `dark:` variants for every colour. Dark mode is class-based, on `<html>`.
  - Reuse `my-btn-primary` / `my-card` and the `components/ui` primitives before writing new CSS.
- **Icons.** Use `unplugin-icons` imports (`import IconX from '~icons/tabler/x'`). Don't add icon packages.
- **UI text is English.** Use sentence case for buttons and tooltips and show keyboard shortcuts as
  `Shortcut: Ctrl + Shift + V`. Don't add Chinese UI strings. The Chinese that remains is data: definitions without an
  English equivalent, and the `isChineseSymbol`-style input checks.
- **Keyboard first.** Any new action that users repeat while practising needs a hotkey (`react-hotkeys-hook`). Make
  sure it doesn't swallow the keys that typing a word needs.
- **No tracking.** Don't add third-party analytics, trackers or remote calls. Only fetch dictionaries, sounds and
  pronunciation audio (Youdao, Wikimedia Commons, and Google Translate TTS for Finnish).
- **Keep it static.** Features must work without a server, so the build can be hosted on any static host or GitHub
  Pages (`REACT_APP_DEPLOY_ENV=pages` sets the router basename). Link to this deployment's root (`/`, or `useHref('/')`
  for an absolute URL), never to a hard-coded domain. The absolute URLs in `index.html` come from the optional
  `SITE_URL` build variable (see `siteUrl()` in `vite.config.ts`).
- **Small, focused changes.** Match the surrounding code, keep components inside the page that owns them unless they
  are shared, and don't reformat unrelated files.

## Before you hand off

`npx tsc --noEmit`, `yarn lint` and `yarn build` must all pass. For UI changes, also run `yarn dev` and check the
Typing page, the Gallery and dark mode.
