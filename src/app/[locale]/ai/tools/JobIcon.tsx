import {
  Code2, FileText, Film, Grid3x3, Image as ImageIcon, LayoutTemplate,
  Megaphone, Mic, PenLine, Search, User, Volume2, Zap,
} from 'lucide-react';

/**
 * Иконка задачи по ключу из админки.
 *
 * Отдельным файлом, а не в полосе задач: эти же иконки нужны странице сервиса
 * и подборкам, а карта «ключ → компонент» в трёх местах разъезжается на
 * первой же новой задаче.
 */
const MAP = {
  pen: PenLine, mic: Mic, wave: Volume2, image: ImageIcon, film: Film,
  mega: Megaphone, volume: Volume2, user: User, code: Code2,
  deck: LayoutTemplate, zap: Zap, search: Search, grid: Grid3x3, text: FileText,
} as const;

export default function JobIcon({ name, size = 15 }: { name?: string; size?: number }) {
  const Icon = MAP[(name ?? 'grid') as keyof typeof MAP] ?? Grid3x3;
  return <Icon size={size} strokeWidth={1.8} className="shrink-0 opacity-80" aria-hidden="true" />;
}
