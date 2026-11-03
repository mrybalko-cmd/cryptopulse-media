/** «1 клик», «3 клика», «12 904 показа» — число с разрядами и нужной формой слова. */
export function pluralRu(n: number, one: string, few: string, many: string): string {
  const m10 = n % 10;
  const m100 = n % 100;
  const word = m10 === 1 && m100 !== 11 ? one : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? few : many;
  return `${n.toLocaleString('ru-RU')} ${word}`;
}
