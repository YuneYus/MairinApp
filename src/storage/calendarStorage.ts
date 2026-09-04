// storage/calendarStorage.ts

import AsyncStorage from "@react-native-async-storage/async-storage";


/*
 Information shared by all stages:
 - menstruation
 - pregnancy
 - menopause
*/
export type CalendarEntry = {

    date: string;       // "2026-07-20"

    exercise: boolean;  // Did exercise

    note: string;       // General daily note

};


const CALENDAR_KEY = "calendar_entries";



/*
 Get all calendar entries
*/
export const getEntries = async (): Promise<CalendarEntry[]> => {

    const data = await AsyncStorage.getItem(CALENDAR_KEY);

    return data ? JSON.parse(data) : [];

};



/*
 Save one calendar day

 If date exists:
 update it

 If not:
 create it
*/
export const saveEntry = async (
    entry: CalendarEntry
): Promise<void> => {


    const entries = await getEntries();


    const filtered = entries.filter(
        (item)=> item.date !== entry.date
    );


    filtered.push(entry);


    await AsyncStorage.setItem(
        CALENDAR_KEY,
        JSON.stringify(filtered)
    );

};



/*
 Get one specific day
*/
export const getEntry = async (
    date:string
): Promise<CalendarEntry | null> => {


    const entries = await getEntries();


    const entry = entries.find(
        item=>item.date === date
    );


    return entry ?? null;

};