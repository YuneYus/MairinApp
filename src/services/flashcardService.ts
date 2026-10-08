
import { getFlashcards } from "../data/flashcards";
import type { AppLanguage } from "@/storage/languageStorage";

export function getDailyFlashcard(language: AppLanguage) {
  const flashcards = getFlashcards(language);
  const today = new Date().toISOString().split("T")[0];
  const dayNumber = Math.floor(new Date(today).getTime() / (1000 * 60 * 60 * 24));
  const index = dayNumber % flashcards.length;

  return flashcards[index];
}