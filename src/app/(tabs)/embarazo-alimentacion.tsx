import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import ButtonCenterCard from "@/components/buttonCenterCard";
import ButtonInfoHeader from "@/components/buttonInfoHeader";
import SpeakableText from "@/components/SpeakableText";
import { colors, globalStyles } from "@/styles/global";

const NUTRIENTS = [
  { name: "nutriente1", why: "importancia1", source: "fuente1" },
  { name: "nutriente2", why: "importancia2", source: "fuente2" },
  { name: "nutriente3", why: "importancia3", source: "fuente3" },
  { name: "nutriente4", why: "importancia4", source: "fuente4" },
  { name: "nutriente5", why: "importancia5", source: "fuente5" },
  { name: "nutriente6", why: "importancia6", source: "fuente6" },
] as const;

export default function EmbarazoAlimentacionScreen() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const filteredNutrients = query
    ? NUTRIENTS.filter((n) =>
        [t(n.name), t(n.why), t(n.source)].join(" ").toLowerCase().includes(query)
      )
    : NUTRIENTS;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ButtonInfoHeader
        title={t("alimentacion")}
        searchValue={search}
        onSearchChange={setSearch}
      />

      <ScrollView style={globalStyles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        {!query && (
          <>
            <ButtonCenterCard>
              <SpeakableText text={t("alimentacionSubtitulo")} style={globalStyles.cardTitle} iconSize={14} />
              <SpeakableText
                text={t("alimentacionDescripcion1")}
                style={[globalStyles.textNormal, { marginTop: 8 }]}
                iconSize={13}
              />
            </ButtonCenterCard>

            <ButtonCenterCard>
              <SpeakableText text={t("alimentacionDescripcion2")} style={globalStyles.textNormal} iconSize={13} />
            </ButtonCenterCard>

            <ButtonCenterCard>
              <SpeakableText text={t("alimentacionDescripcion3")} style={globalStyles.textNormal} iconSize={13} />
            </ButtonCenterCard>
          </>
        )}

        <ButtonCenterCard>
          {filteredNutrients.length === 0 && (
            <Text style={globalStyles.textNormal}>Sin resultados</Text>
          )}
          {filteredNutrients.map((n) => (
            <View key={n.name} style={styles.nutrientRow}>
              <SpeakableText text={t(n.name)} style={styles.nutrientName} iconSize={13} />
              <Text style={styles.nutrientLabel}>{t("importanciaTitulo")}</Text>
              <SpeakableText text={t(n.why)} style={globalStyles.textNormal} iconSize={13} />
              <Text style={styles.nutrientLabel}>{t("fuentesTitulo")}</Text>
              <SpeakableText text={t(n.source)} style={globalStyles.textNormal} iconSize={13} />
            </View>
          ))}
        </ButtonCenterCard>

        {!query && (
          <>
            <ButtonCenterCard style={{ borderColor: colors.text, borderWidth: 1.5 }}>
              <SpeakableText text={t("alcoholTitulo")} style={globalStyles.cardTitle} iconSize={14} />
              <SpeakableText
                text={t("alcoholDescripcion")}
                style={[globalStyles.textNormal, { marginTop: 8 }]}
                iconSize={13}
              />
              <Text style={[globalStyles.label, { marginTop: 12 }]}>{t("alcoholPreguntaTitulo")}</Text>
              <SpeakableText text={t("alcoholRespuesta")} style={globalStyles.textNormal} iconSize={13} />
            </ButtonCenterCard>

            <ButtonCenterCard>
              <SpeakableText text={t("cafeinaTitulo")} style={globalStyles.cardTitle} iconSize={14} />
              <SpeakableText
                text={t("cafeinaRiesgo")}
                style={[globalStyles.textNormal, { marginTop: 8 }]}
                iconSize={13}
              />
              <Text style={[globalStyles.label, { marginTop: 8 }]}>{t("cafeinaFuentes")}</Text>
              <SpeakableText
                text={t("cafeinaConsejo")}
                style={[globalStyles.textNormal, { marginTop: 8 }]}
                iconSize={13}
              />
            </ButtonCenterCard>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  nutrientRow: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  nutrientName: { color: colors.text },
  nutrientLabel: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 8,
  },
});