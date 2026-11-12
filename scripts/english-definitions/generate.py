#!/usr/bin/env python3
"""
Replace the Chinese `trans` of every English-language dictionary in public/dicts
with English definitions.

Sources, in priority order:
  1. supplement.json   – hand-written definitions for function words, common
                         phrases and modern words that WordNet lacks or gets wrong.
  2. Princeton WordNet 3.0 (via NLTK) – the main source.
  3. Webster's Unabridged Dictionary (1913, public domain) – fallback for single
     words, cleaned up heuristically.
  4. Otherwise the original (Chinese) translation is kept unchanged.

Only dictionaries whose `language` and `languageCategory` are both 'en' in
src/resources/dictionary.ts are touched (en2german keeps its German translations). Programming, Japanese, Kazakh, Indonesian, ... dictionaries are left as is.

Usage (from the repo root):
  python3 -m venv .venv && .venv/bin/pip install nltk
  .venv/bin/python -c "import nltk; nltk.download('wordnet')"
  curl -L -o /tmp/webster.json \
    https://raw.githubusercontent.com/matthewreagan/WebstersEnglishDictionary/master/dictionary_compact.json
  .venv/bin/python scripts/english-definitions/generate.py --webster /tmp/webster.json

The script is idempotent: running it on already-converted files re-derives the
same definitions (part-of-speech hints are read from the existing `trans`).
"""

import argparse
import collections
import json
import os
import re
import sys
import unicodedata

from nltk.corpus import wordnet as wn

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
HERE = os.path.dirname(os.path.abspath(__file__))

MAX_SENSES_PER_POS = 2
MAX_POS = 3
MAX_LINE = 160

# Part-of-speech hints found at the start of a translation (e.g. "vt. 取消").
HINT_RE = re.compile(
    r'(?:^|[\s;；,，])(n|v|vt|vi|vbl|adj|a|adv|ad|prep|conj|pron|art|num|int|interj|aux|auxv|modalv|abbr|det|phr|phrase)\.',
    re.IGNORECASE,
)
HINT_TO_WN = {'n': 'n', 'v': 'v', 'vt': 'v', 'vi': 'v', 'vbl': 'v', 'adj': 'a', 'a': 'a', 'adv': 'r', 'ad': 'r'}
HINT_LABEL = {
    'prep': 'prep.', 'conj': 'conj.', 'pron': 'pron.', 'art': 'art.', 'num': 'num.', 'int': 'int.',
    'interj': 'int.', 'aux': 'aux.', 'auxv': 'aux.', 'modalv': 'aux.', 'abbr': 'abbr.', 'det': 'det.',
    'phr': 'phr.', 'phrase': 'phr.',
}
FUNCTION_POS = {'prep', 'conj', 'pron', 'art', 'aux', 'auxv', 'modalv', 'det'}
WN_LABEL = {'n': 'n.', 'v': 'v.', 'a': 'adj.', 'r': 'adv.'}
HAN_RE = re.compile(r'[㐀-鿿]')


def load_english_dict_urls():
    src = open(os.path.join(ROOT, 'src', 'resources', 'dictionary.ts'), encoding='utf-8').read()
    entries = re.findall(r"url: '([^']+)',\s*length: \d+,\s*language: '(\w+)',\s*languageCategory: '(\w+)'", src)
    return sorted({url for url, lang, category in entries if lang == 'en' and category == 'en'})


def pos_hints(trans):
    hints = []
    for t in trans:
        for m in HINT_RE.finditer(str(t)):
            h = m.group(1).lower()
            if h not in hints:
                hints.append(h)
    return hints


def strip_accents(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')


BRITISH = [(r'tre\b', 'ter'), (r'our\b', 'or'), (r'ise\b', 'ize'), (r'ising\b', 'izing'), (r'ised\b', 'ized'),
           (r'isation\b', 'ization'), (r'ogue\b', 'og'), (r'lled\b', 'led'), (r'lling\b', 'ling')]
PLACEHOLDERS = re.compile(r"\b(sb\.?|sth\.?|somebody|something|someone|one's|oneself|doing)(?=\s|$)", re.IGNORECASE)


def candidates(name):
    n = re.sub(r'\s+', ' ', name.strip()).strip(' .!?…')
    out = [n]
    if ' ' in n:
        p = re.sub(r'\s+', ' ', PLACEHOLDERS.sub('', n)).strip()
        out.append(p)
        for prefix in ('be ', 'to '):
            if p.lower().startswith(prefix):
                out.append(p[len(prefix):])
    more = []
    for c in out:
        more.append(strip_accents(c))
        if '-' in c:
            more += [c.replace('-', ''), c.replace('-', ' ')]
        for pat, rep in BRITISH:
            b = re.sub(pat, rep, c)
            if b != c:
                more.append(b)
    seen, result = set(), []
    for c in out + more:
        if c and c not in seen:
            seen.add(c)
            result.append(c)
    return result


def trim(s):
    s = s.strip()
    if len(s) <= MAX_LINE:
        return s
    cut = s[:MAX_LINE]
    i = max(cut.rfind(';'), cut.rfind(','))
    return (cut[:i] if i > 40 else cut.rsplit(' ', 1)[0]) + '…'


def clean_gloss(d):
    # NLTK strips quoted examples out of glosses, leaving fragments like "; ; - Author".
    parts = [p.strip() for p in d.replace('`', "'").split(';')]
    parts = [p for p in parts if p and not p.startswith('-') and p not in ('or', 'and', 'e.g.')]
    return '; '.join(parts)


def wordnet_trans(cands, hints):
    for c in cands:
        key = c.replace(' ', '_')
        syns = wn.synsets(key)
        if syns:
            break
    else:
        return None

    lower = key.lower()
    # Prefer senses where the word itself is a lemma ("goods" must not become "good").
    exact = [s for s in syns if any(l.name().lower() == lower for l in s.lemmas())]
    if exact:
        syns = exact
        bases = {lower}
    else:
        bases = {lower} | {wn.morphy(lower, p) or lower for p in 'nvar'}

    def sense_count(s):
        return sum(l.count() for l in s.lemmas() if l.name().lower() in bases)

    by_pos = collections.OrderedDict()
    score = collections.Counter()
    for s in syns:
        p = 'a' if s.pos() == 's' else s.pos()
        by_pos.setdefault(p, []).append(s)
        score[p] += sense_count(s)
    for p in by_pos:
        # Stable sort keeps WordNet's own order among equally frequent senses.
        by_pos[p].sort(key=lambda s: -sense_count(s))

    wn_hints = [HINT_TO_WN[h] for h in hints if h in HINT_TO_WN]
    wn_hints = list(dict.fromkeys(wn_hints))
    if hints and not wn_hints and all(h in FUNCTION_POS for h in hints):
        # Only function-word POS hints (prep., conj., ...) – WordNet would give a wrong sense.
        return None

    ordered = [p for p in wn_hints if p in by_pos]
    if not ordered:
        ordered = sorted(by_pos, key=lambda p: -score[p])
        if score[ordered[0]] > 0:
            ordered = [p for p in ordered if score[p] > 0]
    lines = []
    for p in ordered[:MAX_POS]:
        defs = []
        for i, s in enumerate(by_pos[p]):
            # Secondary senses only when WordNet has usage evidence for them.
            if i > 0 and sense_count(s) == 0:
                break
            d = clean_gloss(s.definition())
            if d and d not in defs:
                defs.append(d)
            if len(defs) >= MAX_SENSES_PER_POS:
                break
        line = defs[0]
        if len(defs) > 1 and len(line) + len(defs[1]) < MAX_LINE:
            line += '; ' + defs[1]
        lines.append(f'{WN_LABEL[p]} {trim(line)}')
    return lines


def webster_trans(cands, webster, hints):
    if webster is None:
        return None
    for c in cands:
        if ' ' in c or c[:1].isupper():  # proper nouns map to unrelated archaic entries
            continue
        text = webster.get(c.lower())
        if not text:
            continue
        for para in text.split('\n'):
            para = para.strip()
            if not para or '[Obs.]' in para or '[R.]' in para or re.match(r'^(See|Same as|Alt\. of|Variant of|Obs\.)\b', para):
                continue
            para = re.sub(r'^1\.\s*', '', para)
            para = re.split(r'\s\d+\.\s', para)[0]
            sentence = re.split(r'(?<=[a-z\)])\.\s', para)[0].rstrip('.')
            sentence = re.sub(r'\s*--.*$', '', sentence)
            sentence = re.sub(r';\s*(as|esp)\b.*$', '', re.sub(r'^\([a-z]\)\s*', '', sentence)).strip(' ;,')
            if len(sentence) < 3 or HAN_RE.search(sentence):
                continue
            label = next((HINT_LABEL.get(h) or WN_LABEL.get(HINT_TO_WN.get(h, '')) for h in hints), None)
            return [f'{label} {trim(sentence)}' if label else trim(sentence)]
    return None


def detect_indent(raw):
    m = re.search(r'\n( +)\S', raw)
    return len(m.group(1)) if m else 2


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--webster', help='path to Webster 1913 dictionary_compact.json (optional)')
    ap.add_argument('--dry-run', action='store_true')
    args = ap.parse_args()

    supplement = {k.lower(): v for k, v in json.load(open(os.path.join(HERE, 'supplement.json'), encoding='utf-8')).items()}
    webster = json.load(open(args.webster, encoding='utf-8')) if args.webster else None

    totals = collections.Counter()
    still_chinese = collections.Counter()
    for url in load_english_dict_urls():
        path = os.path.join(ROOT, 'public', url.lstrip('./'))
        raw = open(path, encoding='utf-8').read()
        words = json.loads(raw)
        changed = 0
        for w in words:
            name = w.get('name')
            if not isinstance(name, str) or not name.strip():
                continue
            trans = w.get('trans') or []
            hints = pos_hints(trans)
            cands = candidates(name)
            new, src = None, 'kept'
            for c in cands:
                if c.lower() in supplement:
                    new, src = supplement[c.lower()], 'supplement'
                    break
            if new is None:
                new, src = wordnet_trans(cands, hints), 'wordnet'
            if new is None:
                new, src = webster_trans(cands, webster, hints), 'webster'
            if new is None:
                src = 'kept'
                if any(HAN_RE.search(str(t)) for t in trans):
                    still_chinese[name] += 1
            totals[src] += 1
            if new is not None and new != trans:
                w['trans'] = new
                changed += 1
        if changed and not args.dry_run:
            out = json.dumps(words, ensure_ascii=False, indent=detect_indent(raw))
            if raw.endswith('\n'):
                out += '\n'
            open(path, 'w', encoding='utf-8').write(out)
        print(f'{url}: {changed}/{len(words)} updated', file=sys.stderr)

    total = sum(totals.values())
    print(json.dumps({'total': total, **totals, 'unique_still_chinese': len(still_chinese)}, indent=2))
    with open(os.path.join(HERE, 'untranslated.txt'), 'w', encoding='utf-8') as f:
        for name, count in still_chinese.most_common():
            f.write(f'{count}\t{name}\n')


if __name__ == '__main__':
    main()
