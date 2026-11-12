#!/usr/bin/env python3
"""
List the Finnish word recordings on Wikimedia Commons and write a {word: mp3 url} JSON map for build.py --audio.

English Wiktionary links only a handful of Finnish recordings, so the Commons categories are read directly:
  * Category:Finnish pronunciation        files named "Fi-<word>.ogg" (the Wiktionary convention)
  * Category:Lingua Libre pronunciation-fin   files named "LL-Q1412 (fin)-<speaker>-<word>.wav"
Commons files are freely licensed (mostly CC BY-SA). The URL points at Commons' MP3 transcode, because Safari cannot
play Ogg.

Usage: python3 scripts/finnish/commons_audio.py /tmp/fi_audio.json
"""

import hashlib
import json
import re
import sys
import urllib.parse
import urllib.request

API = 'https://commons.wikimedia.org/w/api.php'
CATEGORIES = ['Category:Finnish pronunciation', 'Category:Lingua Libre pronunciation-fin']  # first one wins
PATTERNS = [
    re.compile(r'^Fi-(?P<word>[^ ]+)\.(?:ogg|oga|wav|flac|mp3)$'),
    re.compile(r'^LL-Q1412 \(fin\)-.+-(?P<word>[^-]+)\.(?:wav|ogg|flac|mp3)$'),
]
HEADERS = {'User-Agent': 'qwerty-learner-build-script/1.0'}


def category_files(category):
    params = {'action': 'query', 'list': 'categorymembers', 'cmtitle': category, 'cmtype': 'file', 'cmlimit': '500',
              'format': 'json'}
    while True:
        req = urllib.request.Request(f'{API}?{urllib.parse.urlencode(params)}', headers=HEADERS)
        data = json.load(urllib.request.urlopen(req))
        yield from (m['title'].removeprefix('File:') for m in data['query']['categorymembers'])
        if 'continue' not in data:
            return
        params.update(data['continue'])


def mp3_transcode_url(filename):
    name = filename.replace(' ', '_')
    h = hashlib.md5(name.encode('utf-8')).hexdigest()
    q = urllib.parse.quote(name)
    return f'https://upload.wikimedia.org/wikipedia/commons/transcoded/{h[0]}/{h[:2]}/{q}/{q}.mp3'


def main():
    audio = {}
    for category in CATEGORIES:
        for filename in category_files(category):
            for pattern in PATTERNS:
                m = pattern.match(filename)
                if m and m.group('word') not in audio:
                    audio[m.group('word')] = mp3_transcode_url(filename)
                    break
    with open(sys.argv[1], 'w', encoding='utf-8') as f:
        json.dump(audio, f, ensure_ascii=False, indent=1, sort_keys=True)
    print(f'{len(audio)} words with a recording', file=sys.stderr)


if __name__ == '__main__':
    main()
