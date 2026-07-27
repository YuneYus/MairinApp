// constants/fetalSizeData.ts

export type Trimester = "Primer trimestre" | "Segundo trimestre" | "Tercer trimestre";

export function getTrimester(week: number): Trimester {
  if (week <= 13) return "Primer trimestre";
  if (week <= 27) return "Segundo trimestre";
  return "Tercer trimestre";
}

// Emoji per week — not in the translation file, kept here.
const WEEK_EMOJI: Record<number, string> = {
  4: "🌱", 5: "🌰", 6: "🫘", 7: "🫐", 8: "🍇", 9: "🍇", 10: "🍊",
  11: "🫒", 12: "🍋", 13: "🫛", 14: "🍑", 15: "🍎", 16: "🥑",
  17: "🥔", 18: "🫑", 19: "🍅", 20: "🍌", 21: "🥕", 22: "🥭",
  23: "🥭", 24: "🌽", 25: "🥔", 26: "🥬", 27: "🥦", 28: "🍆",
  29: "🎃", 30: "🥬", 31: "🥥", 32: "🥔", 33: "🍍", 34: "🍈",
  35: "🍈", 36: "🥬", 37: "🥬", 38: "🧅", 39: "🍉", 40: "🍉",
};

export function getWeekEmoji(week: number): string {
  const clamped = Math.min(Math.max(week, 4), 40);
  return WEEK_EMOJI[clamped] ?? "🌱";
}