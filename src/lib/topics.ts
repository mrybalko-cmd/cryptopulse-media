export const TOPICS: Record<string, { ru: string; en: string }> = {
  regulation: { ru: 'Регулирование', en: 'Regulation' },
  defi: { ru: 'DeFi & Web3', en: 'DeFi & Web3' },
  bitcoin: { ru: 'Bitcoin', en: 'Bitcoin' },
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

export const TOPIC_SLUGS = Object.keys(TOPICS);
export const NEWS_TOPIC_SLUGS = Object.keys(NEWS_TOPICS);
