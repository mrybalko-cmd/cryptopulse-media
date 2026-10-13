'use client';

/**
 * «Наверх» в строке иконок футера.
 *
 * Отдельный клиентский кусочек, а не ссылка на #top: якорь добавляет решётку
 * в адрес и остаётся в истории, поэтому «назад» после нажатия возвращает не
 * на предыдущую страницу, а на ту же, только выше.
 */
export default function FooterTopButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={label}
      title={label}
      className="ft-sq"
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 19V5M6 11l6-6 6 6" />
      </svg>
    </button>
  );
}
