<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Где искать первоисточник

Скилл `source-driven-development` требует сверяться с официальной
документацией. Для Next.js официальная документация этого проекта — **та, что
лежит в `node_modules/next/dist/docs/`**, а не nextjs.org: на сайте описана
другая версия, и её советы здесь дают неверный код. Сначала локальные доки,
сайт — только если в локальных нужной темы нет.

Для всего остального (React, Sanity, Tailwind, next-intl) первоисточник
обычный — официальный сайт библиотеки версии, указанной в `package.json`.
