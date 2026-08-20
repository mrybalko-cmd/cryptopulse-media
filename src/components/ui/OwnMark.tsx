import BoltIcon from './BoltIcon';

/**
 * Отметка «наш материал» — золотая молния из фирменного знака перед заголовком.
 *
 * Раньше эту отметку рисовали четыре компонента четырьмя разными способами:
 * красная плашка с текстом на главной, картинка логотипа в списках по темам,
 * жёлтая молния в ленте — а внутри самого материала не рисовал никто. Редактор
 * ставил галочку, открывал новость и ничего не находил. Теперь определение одно.
 *
 * Скобки знака сюда не поместились сознательно: ниже 48 px просвет между
 * скобкой и молнией уходит под пиксель (BRACKET_FLOOR в src/lib/brandMark.tsx),
 * а здесь значку достаётся 11–18 px. Остаётся молния — та же самая, что стоит
 * внутри скобок в полном знаке.
 */
export default function OwnMark({
  size = 12,
  locale,
  className = '',
}: {
  size?: number;
  locale: string;
  className?: string;
}) {
  const label = locale === 'ru' ? 'Наш материал' : 'Our story';
  return (
    <span
      title={label}
      aria-label={label}
      role="img"
      className={`own-mark inline-block align-[-0.1em] mr-1 shrink-0 ${className}`}
    >
      <BoltIcon size={size} />
    </span>
  );
}
