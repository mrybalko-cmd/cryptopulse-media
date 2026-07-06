export const TOPIC_META: Record<string, { ru: string; en: string; rowCls: string; dotCls: string; fallback: string }> = {
  regulation:      { ru: 'Регулирование', en: 'Regulation',    rowCls: 'text-violet-400 bg-violet-400/10', dotCls: 'bg-violet-400',   fallback: '⚖' },
  defi:            { ru: 'DeFi & Web3',   en: 'DeFi & Web3',  rowCls: 'text-blue-400 bg-blue-400/10',    dotCls: 'bg-blue-400',     fallback: '🔗' },
  bitcoin:         { ru: 'Bitcoin',        en: 'Bitcoin',       rowCls: 'text-orange-400 bg-orange-400/10',dotCls: 'bg-orange-400',   fallback: '₿' },
  market:          { ru: 'Рынок',          en: 'Market',        rowCls: 'text-emerald-400 bg-emerald-400/10',dotCls: 'bg-emerald-400', fallback: '📈' },
  technology:      { ru: 'Технологии',     en: 'Technology',    rowCls: 'text-cyan-400 bg-cyan-400/10',    dotCls: 'bg-cyan-400',     fallback: '💻' },
  security:        { ru: 'Безопасность',   en: 'Security',      rowCls: 'text-red-400 bg-red-400/10',      dotCls: 'bg-red-400',      fallback: '🔐' },
  education:       { ru: 'Обучение',       en: 'Education',     rowCls: 'text-yellow-400 bg-yellow-400/10',dotCls: 'bg-yellow-400',   fallback: '📚' },
  'press-release': { ru: 'Пресс-релиз',   en: 'Press Release', rowCls: 'text-muted/70 bg-muted/10',       dotCls: 'bg-muted',        fallback: '📢' },
};
