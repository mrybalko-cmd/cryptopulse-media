import { SITE_HOST } from '@/lib/site';

/**
 * Google Preferred Sources: читатель отмечает нас предпочитаемым источником,
 * и наши материалы потом чаще и выше стоят в его блоке «Главные новости».
 *
 * Google отдаёт для этого виджет (`swg/js/v1/publisher.js` плюс пустой div),
 * но он тянет сторонний скрипт ради одной ссылки. Кнопка внутри — обычный
 * диплинк на тот же инструмент, так это сделано и у incrypted.com. Страница
 * материала и без того грузит около сотни запросов, лишний скрипт тут не нужен.
 *
 * Домен подставляется из SITE_HOST, а не строкой: переезд на новый адрес
 * не должен оставить кнопку указывать на старый.
 */
export default function PreferOnGoogle({ locale }: { locale: string }) {
  return (
    <div className="flex justify-end mb-6">
      <a
        href={`https://www.google.com/preferences/source?q=${SITE_HOST}`}
        target="_blank"
        rel="nofollow noopener"
        className="tap-target inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card py-1.5 pl-3 pr-4 text-[13.5px] font-semibold text-foreground whitespace-nowrap transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40 max-sm:w-full"
      >
        {/* Фирменная «G» остаётся в цветах Google в обеих темах — она и есть
            то, по чему кнопку узнают; перекрашивать её нельзя. */}
        <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true" className="shrink-0">
          <path
            fill="#4285F4"
            d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z"
          />
          <path
            fill="#34A853"
            d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9087-2.2581c-.8059.54-1.8368.8595-3.0477.8595-2.344 0-4.3282-1.5831-5.036-3.7104H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z"
          />
          <path
            fill="#FBBC05"
            d="M3.964 10.71c-.18-.54-.2822-1.1168-.2822-1.71s.1023-1.17.2823-1.71V4.9582H.9573A8.9965 8.9965 0 0 0 0 9c0 1.4523.3477 2.8268.9573 4.0418L3.964 10.71z"
          />
          <path
            fill="#EA4335"
            d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.426 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.964 7.29C4.6718 5.1627 6.656 3.5795 9 3.5795z"
          />
        </svg>
        {locale === 'ru' ? 'Выбирайте нас в Google' : 'Prefer us on Google'}
      </a>
    </div>
  );
}
