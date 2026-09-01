// app/(tabs)/index.tsx

import { useLanguage } from "@/contexts/LanguageContext";
import { colors, globalStyles } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { useCallback, useEffect, useState } from "react";

import Flashcard from "../../components/showquestions";

import { getDailyFlashcard } from "../../services/flashcardService";

import QuoteCard from "@/components/quotecards";
import { getTodaysQuote } from "@/services/quoteService";

import ButtonInfo from "@/components/buttonesInfo";
import CicloInfoCard from "@/components/cicloInfo";
import { getHealthStage, HealthStage } from "@/storage/healthStageStorage";
import { TranslationKey } from "@/translations";
import { router, useFocusEffect } from "expo-router";

import MoodTracker from "@/components/moodTracker";

import { PregnancyJourneyCard } from "@/components/PregnancyJourneyCard";
import { PregnancySizeCard } from "@/components/PregnancySizeCard";

import ChatSummaryCard from "@/components/chatSummaryCard";
import ExerciseStreakCard from "@/components/ExerciseStreakCard";


import SpeakableText from "@/components/SpeakableText";
import WelcomeBanner from "@/components/welcomeBanner";

type IonIcon = keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;

type InfoItem = {
  titleKey: TranslationKey;
  subtitleKey: TranslationKey;
  icon: IonIcon;
  route?: string;
};

// Big card (top) + the stage-specific sub-items, per health stage.
const STAGE_CONFIG: Record<HealthStage, { big: InfoItem; items: InfoItem[] }> = {
  menstruacion: {
    big: {
      titleKey: "Menstruación",
      subtitleKey: "aprenderMasIrregularidades",
      icon: "water-outline",
      route: "/mens-info",
    },
    items: [
      { titleKey: "ejercicio", subtitleKey: "aprenderMas", icon: "walk-outline", route: "/mens-ejercicio" },
      { titleKey: "alimentacionTitulo", subtitleKey: "aprenderMas", icon: "nutrition-outline", route: "/mens-alimento" },
      { titleKey: "educacionSexualTitulo", subtitleKey: "aprenderMas", icon: "book-outline", route: "/mens-educacion" },
      { titleKey: "prevencionTitulo", subtitleKey: "aprenderMas", icon: "shield-checkmark-outline", route: "/mens-prevencion" },
      { titleKey: "recomendacionesTitulo", subtitleKey: "aprenderMas", icon: "clipboard-outline", route: "/mens-recomendacion" },
      { titleKey: "sabiasQueTitulo", subtitleKey: "aprenderMas", icon: "help-circle-outline", route: "/mens-sabiasq" },
    ],
  },
  embarazo: {
    big: {
      titleKey: "Embarazo",
      subtitleKey: "aprenderMas",
      icon: "body-outline",
      route: "/embarazo-info",
    },
    items: [
      {
        titleKey: "alimentacion",
        subtitleKey: "aprenderMas",
        icon: "nutrition-outline",
        route: "/embarazo-alimentacion",
      },
      {
        titleKey: "factoresRiesgo",
        subtitleKey: "aprenderMas",
        icon: "shield-checkmark-outline",
        route: "/embarazo-factoresRiesgo",
      },
      {
        titleKey: "serMama",
        subtitleKey: "aprenderMas",
        icon: "heart-outline",
        route: "/embarazo-serMama",
      },
      {
        titleKey: "prepararParto",
        subtitleKey: "aprenderMas",
        icon: "medkit-outline",
        route: "/embarazo-prepParto",
      },
    ],
  },
  menopausia: {
    big: {
      titleKey: "Menopausia",
      subtitleKey: "aprenderMas",
      icon: "person-outline",
      route: "/meno-menopausia",
    },
    items: [
      {
        titleKey: "Perimenopausia",
        subtitleKey: "aprenderMas",
        icon: "trending-up-outline",
        route: "/meno-perimenopausia",
      },
      {
        titleKey: "PostMenopausia",
        subtitleKey: "aprenderMas",
        icon: "checkmark-circle-outline",
        route: "/meno-posmenopausia",
      },
      {
        titleKey: "PrevenciónEnfermedades",
        subtitleKey: "aprenderMas",
        icon: "call-outline",
        route: "/meno-prevencion",
      },
      {
        titleKey: "ejercicio",
        subtitleKey: "aprenderMas",
        icon: "walk-outline",
        route: "/meno-ejercicio",
      },
    ],
  },
};

// "Aprender De Otros Temas" — always the other two stages, linking out.
const ALL_STAGES: { key: HealthStage; titleKey: TranslationKey; icon: IonIcon }[] = [
  { key: "menstruacion", titleKey: "Menstruación", icon: "water-outline" },
  { key: "embarazo", titleKey: "Embarazo", icon: "body-outline" },
  { key: "menopausia", titleKey: "Menopausia", icon: "person-outline" },
];

function BreathingButton() {
  const { t } = useLanguage();

  return (
    <TouchableOpacity
      style={styles.breathingButton}
      onPress={() => router.push("/BreathingExercise")}
      activeOpacity={0.85}
    >
      <Ionicons name="leaf-outline" size={26} color={colors.text} />
      <SpeakableText
        text={t("respiraConmigo")}
        style={[globalStyles.label, styles.breathingButtonText]}
        iconSize={16}
      />
      <Ionicons name="chevron-forward" size={20} color={colors.text} />
    </TouchableOpacity>
  );
}

function InfoCenter() {
  const { t } = useLanguage();
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

  const config = STAGE_CONFIG[stage];
  const otherStages = ALL_STAGES.filter((s) => s.key !== stage);

  const goTo = (route?: string) => {
    if (route) {
      router.push(route as any);
    }
  };

  const handleOtherStagePress = (targetStage: HealthStage) => {
    if (targetStage === "embarazo") {
      router.push("/embarazo-info");
      return;
    }
    if (targetStage === "menstruacion") {
      router.push("/mens-info");
      return;
    }
    if (targetStage === "menopausia") {
      router.push("/meno-menopausia");
      return;
    }
  };

  return (
    <View style={{ gap: 20 }}>
      {stage === "menopausia" && <ExerciseStreakCard />}
      <ChatSummaryCard />
      <PregnancyJourneyCard />
      <PregnancySizeCard />

      <View>
        <SpeakableText text={t("centroInformacion")} style={styles.sectionTitle} iconSize={18} />

        <ButtonInfo
          title={t(config.big.titleKey)}
          subtitle={t(config.big.subtitleKey)}
          icon={config.big.icon}
          size="big"
          onPress={() => goTo(config.big.route)}
        />

        <View style={styles.grid}>
          {config.items.map((item) => (
            <ButtonInfo
              key={item.titleKey}
              title={t(item.titleKey).trim()}
              subtitle={t(item.subtitleKey)}
              icon={item.icon}
              size="small"
              onPress={() => goTo(item.route)}
            />
          ))}
        </View>

        <SpeakableText
          text={t("aprenderOtrosTemas")}
          style={[styles.sectionTitle, { fontSize: 16, marginTop: 20 }]}
          iconSize={14}
        />

        <View style={styles.grid}>
          {otherStages.map((s) => (
            <ButtonInfo
              key={s.key}
              title={t(s.titleKey)}
              subtitle={t("aprenderMas")}
              icon={s.icon}
              size="small"
              onPress={() => handleOtherStagePress(s.key)}
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
        <BreathingButton />
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
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 20,
    color: colors.text,
    marginBottom: 14,
  },
  breathingButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.inputBackground,
    borderWidth: 1.5,
    borderColor: colors.surface,
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  breathingButtonText: {
    flex: 1,
    minWidth: 0,
    marginTop: 0,
    marginBottom: 0,
  },
});