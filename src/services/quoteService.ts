
import { quotes } from "@/data/quotes";
import type { AppLanguage } from "@/storage/languageStorage";

const DEFAULT_QUOTES: Record<AppLanguage, { id: number; quote: string; author: string | null }> = {
  es: {
    id: 0,
    quote: "Cuida de ti, hoy también merece tu atención.",
    author: null,
  },
  en: {
    id: 0,
    quote: "Take care of yourself; today deserves your attention too.",
    author: null,
  },
  mis: {
    id: 0,
    quote: "Cuida de ti, hoy también merece tu atención.",
    author: null,
  },
};

export const getTodaysQuote = (language: AppLanguage) => {
  const quoteList = quotes[language];
  const defaultQuote = DEFAULT_QUOTES[language];

  if (!quoteList.length) {
    return defaultQuote;
  }

  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return quoteList[dayOfYear % quoteList.length] ?? defaultQuote;
};