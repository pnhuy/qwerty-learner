#!/usr/bin/env python3
"""Read the wiktextract Finnish JSONL on stdin; write a compact JSONL (word, pos, senses, IPA, audio) to argv[1].

`audio` is the MP3 transcode of the entry's first Wikimedia Commons recording (Commons files are freely licensed;
most Finnish recordings are from Lingua Libre, CC BY-SA). MP3 is used because Safari cannot play Ogg.
"""
import sys, json
out = open(sys.argv[1], 'w', encoding='utf-8')
n = 0
for line in sys.stdin:
    try:
        e = json.loads(line)
    except Exception:
        continue
    if e.get('lang_code') != 'fi':
        continue
    senses = []
    for s in e.get('senses', []):
        senses.append({
            'g': s.get('glosses', [])[-1:] ,
            'tags': s.get('tags', []),
            'form_of': [f.get('word') for f in (s.get('form_of') or []) + (s.get('alt_of') or []) if f.get('word')],
        })
    sounds = [x.get('ipa') for x in e.get('sounds', []) if x.get('ipa')][:1]
    audio = [x['mp3_url'] for x in e.get('sounds', []) if x.get('mp3_url')][:1]
    out.write(json.dumps({'w': e.get('word'), 'pos': e.get('pos'), 's': senses, 'ipa': sounds, 'audio': audio},
                         ensure_ascii=False) + '\n')
    n += 1
print(n, file=sys.stderr)
