// components/welcomeBanner.tsx

import { useLanguage } from "@/contexts/LanguageContext";
import { getHealthStage, HealthStage } from "@/storage/healthStageStorage";
import { getProfileInfo } from "@/storage/profilenameStorage";
import { TranslationKey } from "@/translations";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";

import SpeakableText from "@/components/SpeakableText";
import { globalStyles } from "@/styles/global";

const STAGE_MESSAGE_KEYS: Record<HealthStage, TranslationKey> = {
  menstruacion: "BienvenidaTextoMenstruacion",
  embarazo: "BienvenidaTextoEmbarazo",
  menopausia: "BienvenidaTextoMenopausia",
};

export default function WelcomeBanner() {
  const { t } = useLanguage();

  const [firstName, setFirstName] = useState("");
  const [stage, setStage] = useState<HealthStage>("menstruacion");

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const info = await getProfileInfo();
        setFirstName(info.firstName);

        const currentStage = await getHealthStage();
        setStage(currentStage);
      };
      load();
    }, [])
  );

  const displayName = firstName || "Usuaria";

  const titleText = `${t("Bienvenida")} ${displayName}!`;
  const subtitleText = `${t("BienvenidaTexto")} ${t(STAGE_MESSAGE_KEYS[stage])}`;

  return (
    <View style={globalStyles.pinkHeader}>
      <SpeakableText text={titleText} style={globalStyles.pinkHeaderTitle} iconSize={20} />
      <SpeakableText
        text={subtitleText}
        style={[globalStyles.textNormal, { marginTop: 10, textAlign: "center" }]}
        iconSize={16}
      />
    </View>
  );
}