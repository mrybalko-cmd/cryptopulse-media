#!/usr/bin/env python3
"""Свежие ссылающиеся домены из Ahrefs и сверка с файлом отклонения.

Search Console обратные ссылки через API не отдаёт, поэтому новые домены
спам-сети приходится брать у Ahrefs. Скрипт запрашивает список, сортированный
от самых свежих, и показывает три вещи: что Ahrefs пометил спамом, чего ещё
нет в нашем файле отклонения и какие домены выглядят нормальными.

Ключ читается из ~/Desktop/AI/.env (строка AHREFS_API_KEY=...) и в вывод не
попадает. В аргументах командной строки ключ передавать нельзя: он осядет в
истории оболочки и в списке процессов.

    python3 scripts/ahrefs_refdomains.py                # 100 свежих доменов
    python3 scripts/ahrefs_refdomains.py --limit 500    # больше
    python3 scripts/ahrefs_refdomains.py --target cryptopulse.media/
"""
import argparse
import json
import pathlib
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

ENV = pathlib.Path.home() / 'Desktop' / 'AI' / '.env'
DISAVOW = pathlib.Path.home() / 'Desktop' / 'intokened_disavow.txt'
FIELDS = [
    'domain', 'links_to_target', 'is_spam', 'first_seen', 'last_seen',
    'domain_rating', 'dofollow_refdomains', 'dofollow_linked_domains',
    'traffic_domain', 'positions_source_domain', 'new_links', 'lost_links',
    'dofollow_links',
]


def read_key() -> str:
    if not ENV.exists():
        sys.exit(f'Нет файла {ENV}. Добавьте в него строку AHREFS_API_KEY=...')
    m = re.search(r'^AHREFS_API_KEY=(.+)$', ENV.read_text(encoding='utf-8'), re.M)
    if not m:
        sys.exit(f'В {ENV} нет строки AHREFS_API_KEY=...')
    return m.group(1).strip().strip('"').strip("'")


def disavowed() -> set[str]:
    if not DISAVOW.exists():
        return set()
    return {
        line.strip()[len('domain:'):].strip().lower()
        for line in DISAVOW.read_text(encoding='utf-8').split('\n')
        if line.strip().startswith('domain:')
    }


def fetch(key: str, target: str, limit: int) -> list[dict]:
    params = {
        'history': 'live',
        'limit': str(limit),
        'order_by': 'first_seen:desc,domain_rating:desc',
        'select': ','.join(FIELDS),
        'target': target,
    }
    url = 'https://api.ahrefs.com/v3/site-explorer/refdomains?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={
        'Authorization': f'Bearer {key}',
        'Content-Type': 'application/json',
    })
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read()).get('refdomains', [])
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors='replace')[:400]
        hint = {
            401: 'ключ не принят — проверьте значение AHREFS_API_KEY',
            403: 'у ключа нет доступа к Site Explorer или кончились units',
            429: 'превышен лимит запросов, попробуйте позже',
        }.get(e.code, '')
        sys.exit(f'Ahrefs ответил {e.code}. {hint}\n{body}')


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument('--limit', type=int, default=100)
    p.add_argument('--target', default='intokened.com/')
    p.add_argument('--json', action='store_true', help='сохранить сырой ответ рядом со скриптом')
    a = p.parse_args()

    rows = fetch(read_key(), a.target, a.limit)
    if not rows:
        print('Ahrefs вернул пустой список.')
        return

    known = disavowed()
    spam = [r for r in rows if r.get('is_spam')]
    fresh_spam = [r for r in spam if (r.get('domain') or '').lower() not in known]
    clean = [r for r in rows if not r.get('is_spam')]

    print(f'Цель: {a.target} · получено доменов: {len(rows)} (самые свежие сверху)')
    print(f'  помечено спамом Ahrefs : {len(spam)}')
    print(f'  из них уже в нашем файле: {len(spam) - len(fresh_spam)}')
    print(f'  НОВЫХ для отклонения    : {len(fresh_spam)}')
    print(f'  выглядят нормальными    : {len(clean)}')

    if fresh_spam:
        print('\n=== новые спам-домены ===')
        for r in fresh_spam:
            print(f"  {r['domain']:<46} DR {r.get('domain_rating', 0):>3}  "
                  f"ссылок {r.get('links_to_target', 0):>4}  найден {r.get('first_seen', '')[:10]}")
        out = pathlib.Path(__file__).parent / 'ahrefs_new_spam.txt'
        out.write_text('\n'.join(r['domain'] for r in fresh_spam) + '\n', encoding='utf-8')
        print(f'\nСписок сохранён: {out}')
        print(f'Добавить в файл отклонения:\n    python3 ~/Desktop/disavow_merge.py {out}')

    if clean:
        print('\n=== нормальные доноры, самые свежие ===')
        for r in sorted(clean, key=lambda x: -(x.get('domain_rating') or 0))[:15]:
            print(f"  {r['domain']:<46} DR {r.get('domain_rating', 0):>3}  "
                  f"трафик {r.get('traffic_domain', 0):>8}  найден {r.get('first_seen', '')[:10]}")

    if a.json:
        raw = pathlib.Path(__file__).parent / 'ahrefs_refdomains.json'
        raw.write_text(json.dumps(rows, ensure_ascii=False, indent=1), encoding='utf-8')
        print(f'\nСырой ответ: {raw}')


if __name__ == '__main__':
    main()
