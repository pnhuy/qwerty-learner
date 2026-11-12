#!/usr/bin/env python3
"""
Build the levelled Finnish → English word lists in public/dicts/finnish_level_*.json.

Sources
  * English Wiktionary, Finnish entries, as extracted by wiktextract (https://kaikki.org/dictionary/Finnish/),
    CC BY-SA 4.0 / GFDL. Provides lemmas, parts of speech, English glosses, and the
    "inflected form of" links used to map running-text word forms back to their lemma.
  * FrequencyWords by Hermit Dave (https://github.com/hermitdave/FrequencyWords), Finnish 2018 list built from
    OpenSubtitles, CC BY-SA 4.0. Provides word-form frequencies.
  * Pronunciation recordings from Wikimedia Commons (CC BY-SA), from the Wiktionary entries and from the map that
    commons_audio.py writes. Stored as the word's `audio` URL; the app falls back to text-to-speech for the rest.

Method
  1. Every word form in the frequency list is credited to its lemma (a form that is itself a lemma credits itself,
     an inflected form is split evenly between the lemmas it is a form of).
  2. Lemmas are ranked by their summed frequency. Proper nouns, affixes, abbreviations, multi-word entries and
     lemmas whose only senses are archaic/dialectal/offensive are dropped.
  3. The ranked list is cut into levels (see LEVELS). Levels are frequency bands, roughly matching CEFR A1–C1;
     they are not an official CEFR word list.

Usage (from the repo root):
  curl -L https://kaikki.org/dictionary/Finnish/kaikki.org-dictionary-Finnish.jsonl \
    | python3 scripts/finnish/extract.py /tmp/fi_wikt.jsonl   # ~4.6 GB download, streamed
  curl -L -o /tmp/fi_50k.txt https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/fi/fi_50k.txt
  python3 scripts/finnish/commons_audio.py /tmp/fi_audio.json
  python3 scripts/finnish/build.py --wikt /tmp/fi_wikt.jsonl --freq /tmp/fi_50k.txt --audio /tmp/fi_audio.json

The script prints the dictionary.ts entries' lengths; update `length` in src/resources/dictionary.ts if they change.
"""

import argparse
import collections
import json
import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

# (file id, upper rank bound)
LEVELS = [
    ('finnish_level_1', 500),
    ('finnish_level_2', 1500),
    ('finnish_level_3', 3000),
    ('finnish_level_4', 5000),
    ('finnish_level_5', 8000),
]

POS_LABEL = {
    'noun': 'n.', 'verb': 'v.', 'adj': 'adj.', 'adv': 'adv.', 'pron': 'pron.', 'num': 'num.', 'conj': 'conj.',
    'postp': 'postp.', 'prep': 'prep.', 'intj': 'int.', 'det': 'det.', 'particle': 'part.',
}
# Senses with these tags are not useful for a learner's core vocabulary.
DROP_TAGS = {'archaic', 'obsolete', 'dialectal', 'rare', 'offensive', 'derogatory', 'vulgar', 'slur', 'nonstandard',
             'misspelling', 'historical', 'Internet', 'proscribed'}
MAX_SENSES = 3
MAX_POS = 2
MAX_LINE = 100
INFLECTION = re.compile(
    r'\b(singular|plural|person|participle|infinitive|indicative|imperative|potential|conditional|nominative|genitive|'
    r'partitive|inessive|elative|illative|adessive|ablative|allative|essive|translative|comitative|instructive|abessive|'
    r'possessive|comparative|superlative|connegative|passive|form) .*\bof ([a-zåäö]+)$'
)
NOISE = re.compile(r'logic gate|letter of the|Hebrew|Phoenician|abjad|alphabet', re.IGNORECASE)
VALID_WORD = re.compile(r"^[a-zåäöšž]+$")


def clean_gloss(g):
    # Drop explanatory parentheses/brackets ("floor (bottom of a room)" -> "floor") when something is left.
    short = re.sub(r'\s*[\(\[][^\(\)\[\]]*[\)\]]', '', g)
    short = re.sub(r'\s*[\(\[][^\(\)\[\]]*[\)\]]', '', short)  # nested
    g = short if len(short.strip(' ,;')) >= 2 else g
    return re.sub(r'\s+', ' ', g).strip(' ,;').rstrip('.').replace(' ,', ',')


def trim(s):
    if len(s) <= MAX_LINE:
        return s
    cut = s[:MAX_LINE]
    i = max(cut.rfind(';'), cut.rfind(','))
    return (cut[:i] if i > 40 else cut.rsplit(' ', 1)[0]) + '…'


def load_wiktionary(path):
    lemmas = collections.defaultdict(collections.OrderedDict)  # word -> pos -> [glosses]
    form_of = collections.defaultdict(set)  # form -> {lemma}
    audio = {}  # word -> recording URL
    for line in open(path, encoding='utf-8'):
        e = json.loads(line)
        word, pos = e.get('w'), e.get('pos')
        if not word:
            continue
        if e.get('audio') and word not in audio:
            audio[word] = e['audio'][0]
        for s in e['s']:
            if s['form_of']:
                for lemma in s['form_of']:
                    if lemma != word:
                        form_of[word].add(lemma)
                continue
            if pos not in POS_LABEL or not s['g']:
                continue
            if DROP_TAGS & set(s['tags']):
                continue
            m = INFLECTION.search(s['g'][0])
            if m:  # inflected form without a structured form_of link
                if m.group(2) != word:
                    form_of[word].add(m.group(2))
                continue
            gloss = clean_gloss(s['g'][0])
            if not gloss or NOISE.search(gloss):
                continue
            glosses = lemmas[word].setdefault(pos, [])
            if gloss not in glosses:
                glosses.append(gloss)
    return {w: p for w, p in lemmas.items() if p}, form_of, audio


def rank_lemmas(freq_path, lemmas, form_of):
    score = collections.defaultdict(float)
    for line in open(freq_path, encoding='utf-8'):
        parts = line.split()
        if len(parts) != 2:
            continue
        form, count = parts[0], int(parts[1])
        # A form is credited evenly to itself (if it is a lemma) and to every lemma it is an inflection of,
        # so e.g. "voi" counts both for "voi" (butter) and "voida" (can).
        targets = [l for l in form_of.get(form, ()) if l in lemmas] + ([form] if form in lemmas else [])
        for l in targets:
            score[l] += count / len(targets)
    return sorted(score, key=lambda w: -score[w])


def to_trans(pos_glosses):
    lines = []
    for pos, glosses in pos_glosses.items():
        line = f'{POS_LABEL[pos]} {glosses[0]}'
        for g in glosses[1:MAX_SENSES]:
            if len(line) + len(g) + 2 > MAX_LINE:
                break
            line += f'; {g}'
        lines.append(trim(line))
    return lines[:MAX_POS]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--wikt', required=True)
    ap.add_argument('--freq', required=True)
    ap.add_argument('--audio', help='{word: url} JSON from commons_audio.py')
    args = ap.parse_args()

    lemmas, form_of, audio = load_wiktionary(args.wikt)
    if args.audio:
        audio = {**json.load(open(args.audio, encoding='utf-8')), **audio}
    ranked = [w for w in rank_lemmas(args.freq, lemmas, form_of) if VALID_WORD.match(w) and len(w) > 1]

    start = 0
    for file_id, end in LEVELS:
        words = [{'name': w, 'trans': to_trans(lemmas[w]), **({'audio': audio[w]} if w in audio else {})} for w in ranked[start:end]]
        path = os.path.join(ROOT, 'public', 'dicts', f'{file_id}.json')
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(words, f, ensure_ascii=False, indent=2)
            f.write('\n')
        with_audio = sum('audio' in w for w in words)
        print(f'{file_id}: {len(words)} words (ranks {start + 1}-{start + len(words)}), {with_audio} with a recording')
        start = end


if __name__ == '__main__':
    main()
