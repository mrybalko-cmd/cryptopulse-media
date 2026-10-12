/**
 * Раздел сделок закрыт плотнее остальной админки.
 *
 * Вся админка уже отдаёт noindex, но здесь к нему добавлены noarchive и
 * nosnippet: даже если адрес куда-то утечёт, у поисковика не останется ни
 * копии страницы в кэше, ни строки с цифрами в выдаче. Те же правила стоят
 * заголовками ответа в next.config.ts — метатег закрывает случай, когда
 * страницу сохранили в файл, заголовок — когда её тянет робот.
 */
export const metadata = {
  title: 'Коммерческие размещения',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    nocache: true,
  },
};

export default function DealsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
