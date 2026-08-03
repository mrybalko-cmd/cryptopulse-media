export const TOPICS: Record<string, { ru: string; en: string }> = {
  regulation: { ru: 'Регулирование', en: 'Regulation' },
  defi: { ru: 'DeFi & Web3', en: 'DeFi & Web3' },
  bitcoin: { ru: 'Биткоин', en: 'Bitcoin' },
  market: { ru: 'Рынок', en: 'Market' },
  technology: { ru: 'Технологии', en: 'Technology' },
  security: { ru: 'Безопасность', en: 'Security' },
  education: { ru: 'Обучение', en: 'Education' },
  ai: { ru: 'Искусственный интеллект', en: 'AI & Machine Learning' },
};

export const NEWS_TOPICS: Record<string, { ru: string; en: string }> = {
  ...TOPICS,
  'press-release': { ru: 'Пресс-релиз', en: 'Press Release' },
};

// Compact per-topic tag for the news feed meta line: a short label (shorter
// than TOPICS — e.g. AI → "ИИ" — so it fits next to the timestamp) plus a
// colour used for the small dot that gives the feed a quick visual code.
export const TOPIC_TAG: Record<string, { ru: string; en: string; color: string }> = {
  regulation: { ru: 'Регулирование', en: 'Regulation', color: '#f59e0b' },
  defi:       { ru: 'DeFi',          en: 'DeFi',        color: '#10b981' },
  bitcoin:    { ru: 'Биткоин',       en: 'Bitcoin',     color: '#f7931a' },
  market:     { ru: 'Рынок',         en: 'Market',      color: '#3b82f6' },
  technology: { ru: 'Технологии',    en: 'Technology',  color: '#06b6d4' },
  security:   { ru: 'Безопасность',  en: 'Security',    color: '#ef4444' },
  education:  { ru: 'Обучение',      en: 'Education',    color: '#64748b' },
  ai:         { ru: 'ИИ',            en: 'AI',           color: '#8b5cf6' },
};

export const TOPIC_SLUGS = Object.keys(TOPICS);
export const NEWS_TOPIC_SLUGS = Object.keys(NEWS_TOPICS);
