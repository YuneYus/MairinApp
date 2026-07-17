import { globalStyles } from "@/styles/global";
import { Alert, Button, ScrollView, Switch, Text, TextInput, View } from "react-native";

import { useEffect, useState } from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";

import { getEntries, getEntry, saveEntry } from "../../storage/calendarStorage";



LocaleConfig.locales["es"] = {
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  monthNamesShort: [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ],
  dayNames: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  dayNamesShort: [
    "Dom",
    "Lun",
    "Mar",
    "Mié",
    "Jue",
    "Vie",
    "Sáb",
  ],
  today: "Hoy",
};

LocaleConfig.defaultLocale = "es";

export default function CalendarScreen() {
    //get today's date
    const today = new Date();


    //Form the year/month.day
    const todayString = today.toISOString().split("T")[0];

    //selectDate Stores the day currently selected
    //intially it is today's date
    //selectedDate stores data and setSelectedDate(...) change the date
    const [selectedDate,setSelectedDate] = useState(todayString)
    const [period, setPeriod] = useState(false);
    const [exercise, setExercise] = useState(false);
    const [mood, setMood] = useState("");
    const [note, setNote] = useState("");

    const [markedDates, setMarkedDates] = useState<any>({});


        const loadMarkedDates = async () => {

  const entries = await getEntries();

  const marks: any = {};

  entries.forEach((entry) => {

    const dots = [];

    if (entry.period) {
      dots.push({
        key: "period",
        color: "#F48FB1", // pink
      });
    }

    if (entry.exercise) {
      dots.push({
        key: "exercise",
        color: "#66BB6A", // green
      });
    }

    if (entry.mood !== "") {
      dots.push({
        key: "mood",
        color: "#FFD54F", // yellow
      });
    }

    marks[entry.date] = {
      dots,
    };
  });

  // Keep the selected date highlighted
  marks[selectedDate] = {
    ...(marks[selectedDate] || {}),
    selected: true,
    selectedColor: "#E91E63",
  };

  setMarkedDates(marks);
};

       const loadEntry = async () => {

    try {

        console.log("Selected date:", selectedDate);

        //check 1 entry bwhich is the selected date
        const data = await getEntry(selectedDate);
                console.log("Calendar entries:", data);

        //check all entries in the storage
        const entries = await getEntries();
        console.log("All entries:", entries);

        entries.forEach((entry) => {
  console.log("Stored date:", entry.date);


});

            
        if (data) {

            setPeriod(data.period);
            setExercise(data.exercise);
            setMood(data.mood);
            setNote(data.note);

        } else {

            setPeriod(false);
            setExercise(false);
            setMood("");
            setNote("");
        }

    } catch(error) {

        console.log("Error loading entry:", error);

    }
};

        useEffect(() => {

            loadEntry();
            loadMarkedDates();


        }, [selectedDate]);

    const handleSave = async () => {

    await saveEntry({

            date: selectedDate,
            period,
            exercise,
            mood,
            note,
        });

        await loadMarkedDates();

        Alert.alert(
            "Saved!",
            "Your day has been saved."
        );
    };

    const formattedDate = new Date(selectedDate).toLocaleDateString(
  "es-ES",
  {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }
);

    return(
     <ScrollView style= {globalStyles.container}>

        <Text style={globalStyles.title}>Calendar</Text>


            <Calendar
            markingType="multi-dot"

            onDayPress={(day) => {
                setSelectedDate(day.dateString);
            }}

            markedDates={markedDates}
        />

       <Text style={globalStyles.sectionTitle}>
            {formattedDate}
        </Text>

        <Text style={{ marginTop:20, fontSize:18 }}>
            Selected Date:
        </Text>

        <Text>🩸 On my period today</Text>

            <Switch
                value={period}
                onValueChange={setPeriod}
            />
        
        <Text>💪 Exercised today</Text>

            <Switch
                value={exercise}
                onValueChange={setExercise}
            />

        
        <Text>😊 Mood</Text>

        <View style={{ flexDirection: "row", gap: 10 }}>

            <Button
                title="😀"
                onPress={() => setMood("😀")}
            />

            <Button
                title="🙂"
                onPress={() => setMood("🙂")}
            />

            <Button
                title="😐"
                onPress={() => setMood("😐")}
            />

            <Button
                title="😔"
                onPress={() => setMood("😔")}
            />

                <Text>
                Selected mood: {mood}
                </Text>
        </View>

            <TextInput
                    placeholder="Daily Notes"
                    value={note}
                    onChangeText={setNote}
                    multiline
                    style={{
                        borderWidth:1,
                        padding:10,
                        marginTop:15,
                        borderRadius:10,
                        minHeight:100,
                    }}
                />
        <Button
            title="Guardar"
            onPress={handleSave}
        />
        
    </ScrollView>
    )
}

