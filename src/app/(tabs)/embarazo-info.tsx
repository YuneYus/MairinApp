import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import ButtonCenterBulletList from "@/components/buttonCenterBulletList";
import ButtonCenterCard from "@/components/buttonCenterCard";
import ButtonInfoHeader from "@/components/buttonInfoHeader";
import SpeakableText from "@/components/SpeakableText";
import { colors, globalStyles } from "@/styles/global";
import { TranslationKey } from "@/translations";

type Trimester = {
  n: number;
  titleKey: TranslationKey;
  semanasKey: TranslationKey;
  bebeTituloKey: TranslationKey;
  bebeKey: TranslationKey;
  mamaTituloKey: TranslationKey;
  mamaKeys: TranslationKey[];
  atencionTituloKey: TranslationKey;
  atencionKeys: TranslationKey[];
};

const TRIMESTERS: Trimester[] = [
  {
    n: 1,
    titleKey: "primerTrimestreTitulo",
    semanasKey: "primerTrimestreSemanas",
    bebeTituloKey: "primerTrimestreBebeTitulo",
    bebeKey: "primerTrimestreBebe",
    mamaTituloKey: "primerTrimestreMamaTitulo",
    mamaKeys: [
      "primerTrimestreMama1",
      "primerTrimestreMama2",
      "primerTrimestreMama3",
      "primerTrimestreMama4",
      "primerTrimestreMama5",
      "primerTrimestreMama6",
    ],
    atencionTituloKey: "primerTrimestreAtencionTitulo",
    atencionKeys: [
      "primerTrimestreAtencion1",
      "primerTrimestreAtencion2",
      "primerTrimestreAtencion3",
      "primerTrimestreAtencion4",
      "primerTrimestreAtencion5",
      "primerTrimestreAtencion6",
    ],
  },
  {
    n: 2,
    titleKey: "segundoTrimestreTitulo",
    semanasKey: "segundoTrimestreSemanas",
    bebeTituloKey: "segundoTrimestreBebeTitulo",
    bebeKey: "segundoTrimestreBebe",
    mamaTituloKey: "segundoTrimestreMamaTitulo",
    mamaKeys: [
      "segundoTrimestreMama1",
      "segundoTrimestreMama2",
      "segundoTrimestreMama3",
      "segundoTrimestreMama4",
      "segundoTrimestreMama5",
      "segundoTrimestreMama6",
    ],
    atencionTituloKey: "segundoTrimestreAtencionTitulo",
    atencionKeys: [
      "segundoTrimestreAtencion1",
      "segundoTrimestreAtencion2",
      "segundoTrimestreAtencion3",
      "segundoTrimestreAtencion4",
      "segundoTrimestreAtencion5",
    ],
  },
  {
    n: 3,
    titleKey: "tercerTrimestreTitulo",
    semanasKey: "tercerTrimestreSemanas",
    bebeTituloKey: "tercerTrimestreBebeTitulo",
    bebeKey: "tercerTrimestreBebe",
    mamaTituloKey: "tercerTrimestreMamaTitulo",
    mamaKeys: [
      "tercerTrimestreMama1",
      "tercerTrimestreMama2",
      "tercerTrimestreMama3",
      "tercerTrimestreMama4",
      "tercerTrimestreMama5",
      "tercerTrimestreMama6",
    ],
    atencionTituloKey: "tercerTrimestreAtencionTitulo",
    atencionKeys: [
      "tercerTrimestreAtencion1",
      "tercerTrimestreAtencion2",
      "tercerTrimestreAtencion3",
      "tercerTrimestreAtencion4",
    ],
  },
];

export default function EmbarazoInfoScreen() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const trimesterMatches = (tri: Trimester) => {
    if (!query) return true;
    const haystack = [
      t(tri.titleKey),
      t(tri.bebeTituloKey),
      t(tri.bebeKey),
      t(tri.mamaTituloKey),
      ...tri.mamaKeys.map((k) => t(k)),
      t(tri.atencionTituloKey),
      ...tri.atencionKeys.map((k) => t(k)),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  };

  const filteredTrimesters = TRIMESTERS.filter(trimesterMatches);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ButtonInfoHeader
        title={t("embarazoTitulo")}
        searchValue={search}
        onSearchChange={setSearch}
      />

      <ScrollView style={globalStyles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        {!query && (
          <SpeakableText
            text={t("embarazoDescripcion")}
            style={[globalStyles.textNormal, { marginTop: 12 }]}
            iconSize={13}
          />
        )}

        {filteredTrimesters.length === 0 && (
          <Text style={[globalStyles.textNormal, { marginTop: 20 }]}>Sin resultados</Text>
        )}

        {filteredTrimesters.map((tri) => (
          <View key={tri.n} style={styles.trimesterBlock}>
            <View style={styles.trimesterHeader}>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>{tri.n}</Text>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <SpeakableText text={t(tri.titleKey)} style={globalStyles.cardTitle} iconSize={16} />
                <SpeakableText text={t(tri.semanasKey)} style={styles.semanasText} iconSize={11} />
              </View>
            </View>

            <ButtonCenterCard>
              <Text style={globalStyles.label}>{t(tri.bebeTituloKey)}</Text>
              <SpeakableText text={t(tri.bebeKey)} style={globalStyles.textNormal} iconSize={13} />
            </ButtonCenterCard>

            <ButtonCenterCard>
              <Text style={globalStyles.label}>{t(tri.mamaTituloKey)}</Text>
              <ButtonCenterBulletList items={tri.mamaKeys.map((k) => t(k))} />
            </ButtonCenterCard>

            <ButtonCenterCard>
              <Text style={globalStyles.label}>{t(tri.atencionTituloKey)}</Text>
              <ButtonCenterBulletList items={tri.atencionKeys.map((k) => t(k))} />
            </ButtonCenterCard>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  trimesterBlock: { marginTop: 28 },
  trimesterHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  numberCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 16,
    color: colors.text,
  },
  semanasText: {
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
});