
import { quotes } from "@/data/quotes";

export const getTodaysQuote = () => {
  const today = new Date();

  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return quotes[dayOfYear % quotes.length];
};