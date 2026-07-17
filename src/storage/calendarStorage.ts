
import AsyncStorage from '@react-native-async-storage/async-storage';
/*
This describes what information is stored
for ONE specific day.
*/
export type DayEntry = {
  date: string;          // Example: "2026-07-15"

  period: boolean;       // true if on period

  exercise: boolean;     // true if exercised

  mood: string;          // 😊 😐 😔 etc.

  note: string;          // User's note
};


//This is the name used inside AsyncStorage.
const CALENDAR_KEY = "calendar_entries";

/*
Returns ALL saved calendar entries.

If nothing exists yet,
return an empty array.
*/
export const getEntries = async (): Promise<DayEntry[]> => {
  const data = await AsyncStorage.getItem(CALENDAR_KEY);

  return data ? JSON.parse(data) : [];
  
};

/*
Saves one day.

If the date already exists,
replace it.

If it doesn't,
add it.
*/
export const saveEntry = async (
  entry: DayEntry,
): Promise<void> => {
  const entries = await getEntries();

  // Remove old entry for this date
  const filtered = entries.filter(
    (item) => item.date !== entry.date,
  );

  // Add updated entry
  filtered.push(entry);

  await AsyncStorage.setItem(
    CALENDAR_KEY,
    JSON.stringify(filtered),
  );
};

/*
Returns the information
for ONE selected day.
*/
export const getEntry = async (
  date: string,
): Promise<DayEntry | null> => {
  const entries = await getEntries();

  const entry = entries.find(
    (item) => item.date === date,
  );

  return entry ?? null;
};
