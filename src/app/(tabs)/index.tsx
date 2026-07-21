import { globalStyles } from "@/styles/global";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";


import { speakText } from '../../services/voiceService';

import { useCallback, useEffect, useState } from "react";

import Flashcard from "../../components/showquestions";

import { getDailyFlashcard } from "../../services/flashcardService";

import QuoteCard from "@/components/quotecards";
import { getTodaysQuote } from "@/services/quoteService";

import ButtonInfo from "@/components/buttonesInfo";
import CicloInfoCard from "@/components/cicloInfo";
import { getHealthStage, HealthStage } from "@/storage/healthStageStorage";
import { router, useFocusEffect } from "expo-router";

import MoodTracker from "@/components/moodTracker";


// app/(tabs)/index.tsx
import { PregnancyJourneyCard } from "@/components/PregnancyJourneyCard";
import { PregnancySizeCard } from "@/components/PregnancySizeCard";

import ChatSummaryCard from "@/components/chatSummaryCard";


const ALL_ITEMS: {
  key: HealthStage | "ejercicio" | "educacion";
  title: string;
  subtitle: string;
  icon: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
}[] = [
  {
    key: "menstruacion",
    title: "Menstruación",
    subtitle: "Aprender más: irregularidades y síntomas",
    icon: "call",
  },
  { key: "ejercicio", title: "Ejercicios y cuido", subtitle: "Aprender más", icon: "call" },
  { key: "educacion", title: "Educación Sexual", subtitle: "Aprender más", icon: "call" },
  { key: "embarazo", title: "Embarazo", subtitle: "Aprender más", icon: "call" },
  { key: "menopausia", title: "Menopausia", subtitle: "Aprender más", icon: "call" },
];


function InfoCenter() {
  const [stage, setStage] = useState<HealthStage>("menstruacion");

  // Re-read every time the Inicio tab comes into focus,
  // so switching stage in Ajustes updates this immediately
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const value = await getHealthStage();
        setStage(value);
      };

      load();
    }, [])
  );

  const bigItem = ALL_ITEMS.find((item) => item.key === stage)!;
  const smallItems = ALL_ITEMS.filter((item) => item.key !== stage);

  // Routes each info-center category to its screen. Only "embarazo" has a
  // destination wired up so far — the others keep the original TODO.
  const handleItemPress = (key: (typeof ALL_ITEMS)[number]["key"]) => {
    if (key === "embarazo") {
      router.push("/viaje-embarazo");
      return;
    }
    // TODO: navigate to the relevant info screen for the other categories
  };

  return (
    
    <View style={{ marginTop: 30 }}>
      <MoodTracker/>
      <ChatSummaryCard />
      <PregnancyJourneyCard />
      <PregnancySizeCard />

      <Text style={styles.sectionTitle}>Centro De Información</Text>
      <ButtonInfo
        title={bigItem.title}
        subtitle={bigItem.subtitle}
        icon={bigItem.icon}
        size="big"
        onPress={() => handleItemPress(bigItem.key)}
      />

      <Text style={{fontFamily: "Montserrat_400Regular"}}>This is the font: Montserrat_400Regular - hi there ashley</Text>
              <Text style={{fontFamily: "Montserrat_700Bold"}}>This is the font: Montserrat_700Bold - hi there ashley</Text>
              <Text style={{fontFamily: "OpenSans_400Regular"}}>This is the font: OpenSans_400Regular- hi there ashley</Text>
              <Text style={{fontFamily: "OpenSans_700Bold"}}>This is the font: OpenSans_700Bold- hi there ashley</Text>
              <Text style={{fontFamily: "LeagueSpartan_400Regular"}}>This is the font: LeagueSpartan_400Regular- hi there ashley</Text>
              <Text style={{fontFamily: "LeagueSpartan_700Bold"}}>This is the font: LeagueSpartan_700Bold- hi there ashley</Text>

      <View style={styles.grid}>
        {smallItems.map((item) => (
          <ButtonInfo
            key={item.key}
            title={item.title}
            subtitle={item.subtitle}
            icon={item.icon}
            size="small"
            onPress={() => handleItemPress(item.key)}
          />
        ))}
      </View>
    </View>
  );
}

export default function Homescreen() {
console.log("HOME SCREEN LOADED");

const todaysQuote = getTodaysQuote();

 const [question, setQuestion] = useState<any>(null);


  useEffect(() => {

    // Gets the question of the day
    const dailyQuestion = getDailyFlashcard();

    setQuestion(dailyQuestion);

  }, []);



return(

  
   <ScrollView
      style={{
        marginTop: 50,
       flex: 1,
    padding: 20,
      }}
    >

      <QuoteCard quote={todaysQuote.quote} />

      <TouchableOpacity
        style={{ backgroundColor: '#007AFF', borderRadius: 8}}
        onPress={() =>
          speakText(
            "Hola Ashley, aqui esta la prueba de voz para la aplicacion"
          )
        }>
          <Text style= {{color:"white", fontFamily:globalStyles.title.fontFamily}}>🔉Hola Ashley, aqui esta la prueba de voz para la aplicacion. Hola Ashley, aqui esta la prueba de voz para la aplicacion. Hola Ashley, aqui esta la prueba de voz para la aplicacion</Text>
      </TouchableOpacity>

<CicloInfoCard />

       <View >
{
question &&

<Flashcard data={question}/>
}

    </View>
         
  
    <InfoCenter/>

    </ScrollView>
    
)

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent:"center",
    backgroundColor: "#cff7ff",
    padding: 10,
    //paddingTop: 10,
    //paddingLeft:20
    //paddingHorizontal: 10
  },
  text: {
    fontSize: 23,
    fontWeight: "bold",
    fontFamily: "LeagueSpartan_700Bold",
  },
   title: {
    color: "blue",
    fontWeight:"bold",
    fontFamily: "LeagueSpartan_400Regular",
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: "space-between",

  },
    sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#B0195B",
    marginBottom: 14,
  },
  
  
});
