

import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import ButtonCenterCard from "@/components/buttonCenterCard";
import ButtonInfoHeader from "@/components/buttonInfoHeader";
import SpeakableText from "@/components/SpeakableText";
import { colors, globalStyles } from "@/styles/global";

const SECTIONS = [
  { titleKey: "prevencionOseaTitulo", textKey: "prevencionOseaTexto", accionKey: "prevencionOseaAccion" },
  { titleKey: "prevencionCardioTitulo", textKey: "prevencionCardioTexto", accionKey: "prevencionCardioAccion" },
  { titleKey: "prevencionPelvicoTitulo", textKey: "prevencionPelvicoTexto", accionKey: "prevencionPelvicoAccion" },
] as const;

export default function MenoPrevencionScreen() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const filtered = query
    ? SECTIONS.filter((s) => [t(s.titleKey), t(s.textKey), t(s.accionKey)].join(" ").toLowerCase().includes(query))
    : SECTIONS;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ButtonInfoHeader title={t("PrevenciónEnfermedades")} searchValue={search} onSearchChange={setSearch} />

      <ScrollView style={globalStyles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        {filtered.length === 0 && (
          <Text style={[globalStyles.textNormal, { marginTop: 20 }]}>Sin resultados</Text>
        )}

        {filtered.map((s) => (
          <ButtonCenterCard key={s.titleKey}>
            <SpeakableText text={t(s.titleKey)} style={globalStyles.cardTitle} iconSize={14} />
            <SpeakableText text={t(s.textKey)} style={[globalStyles.textNormal, { marginTop: 6 }]} iconSize={13} />
            <Text style={[globalStyles.label, { marginTop: 8 }]}>Prevención:</Text>
            <SpeakableText text={t(s.accionKey)} style={globalStyles.textNormal} iconSize={13} />
          </ButtonCenterCard>
        ))}
      </ScrollView>
    </View>
  );
}