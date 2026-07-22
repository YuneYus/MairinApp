

// utils/exerciseStreak.ts

import { getMenopauseEntries } from "@/storage/menopauseStorage";

export type DayStatus = "done" | "missed" | "future";

export type ExerciseStreakData = {
  streak: number;
  week: { label: string; status: DayStatus; dateString: string }[];
};

const DAY_LABELS = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

function toDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

function startOfWeekMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, ...
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getExerciseStreakData(): Promise<ExerciseStreakData> {
  const entries = await getMenopauseEntries();
  const exerciseMap = new Map<string, boolean>();
  entries.forEach((entry) => {
    exerciseMap.set(entry.date, entry.exercise);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayString = toDateString(today);

  // Count consecutive days backward from today
  let streak = 0;
  const cursor = new Date(today);

  while (true) {
    const cursorString = toDateString(cursor);
    const didExercise = exerciseMap.get(cursorString);

    if (cursorString === todayString) {
      // Today may not be answered yet — don't break the streak for that,
      // just don't count it until it's explicitly marked true.
      if (didExercise === true) {
        streak += 1;
      } else if (didExercise === false) {
        break;
      }
    } else if (didExercise === true) {
      streak += 1;
    } else {
      break;
    }

    cursor.setDate(cursor.getDate() - 1);
  }

  // Build current week row (Mon–Sun)
  const monday = startOfWeekMonday(today);
  const week = DAY_LABELS.map((label, index) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + index);
    const dayString = toDateString(day);

    let status: DayStatus;
    if (day.getTime() > today.getTime()) {
      status = "future";
    } else {
      status = exerciseMap.get(dayString) ? "done" : "missed";
    }

    return { label, status, dateString: dayString };
  });

  return { streak, week };
}