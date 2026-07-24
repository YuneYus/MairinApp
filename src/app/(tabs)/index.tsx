import { colors, globalStyles } from "@/styles/global";
import { ScrollView, StyleSheet, Text, View } from "react-native";

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

import { PregnancyJourneyCard } from "@/components/PregnancyJourneyCard";
import { PregnancySizeCard } from "@/components/PregnancySizeCard";

import ChatSummaryCard from "@/components/chatSummaryCard";
import ExerciseStreakCard from "@/components/ExerciseStreakCard";

import SponsorshipAd from "@/components/sponsorshipAd";

import WelcomeBanner from "@/components/welcomeBanner";

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

  const handleItemPress = (key: (typeof ALL_ITEMS)[number]["key"]) => {
    if (key === "embarazo") {
      router.push("/viaje-embarazo");
      return;
    }
    // TODO: navigate to the relevant info screen for the other categories
  };

  return (
    <View style={{ gap: 20 }}>
      {stage === "menopausia" && <ExerciseStreakCard />}
      <ChatSummaryCard />
      <PregnancyJourneyCard />
      <PregnancySizeCard />

      <View>
        <Text style={styles.sectionTitle}>Centro De Información</Text>
        <ButtonInfo
          title={bigItem.title}
          subtitle={bigItem.subtitle}
          icon={bigItem.icon}
          size="big"
          onPress={() => handleItemPress(bigItem.key)}
        />

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
    </View>
  );
}

export default function Homescreen() {
  const todaysQuote = getTodaysQuote();

  const [question, setQuestion] = useState<any>(null);

  useEffect(() => {
    const dailyQuestion = getDailyFlashcard();
    setQuestion(dailyQuestion);
  }, []);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
      <WelcomeBanner />

      <View style={styles.content}>
        <SponsorshipAd />
        <QuoteCard quote={todaysQuote.quote} />
        <CicloInfoCard />
                <InfoCenter />
                      <MoodTracker />

        {question && <Flashcard data={question} />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    ...globalStyles.content,
    gap: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 14,
  },
});