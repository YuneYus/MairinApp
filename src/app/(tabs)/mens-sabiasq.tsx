

import { useLanguage } from "@/contexts/LanguageContext";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import ButtonInfoHeader from "@/components/buttonInfoHeader";
import SpeakableText from "@/components/SpeakableText";
import { colors, globalStyles } from "@/styles/global";

const DATOS_KEYS = [
  "sabiasQue1","sabiasQue2","sabiasQue3","sabiasQue4","sabiasQue5",
  "sabiasQue6","sabiasQue7","sabiasQue8","sabiasQue9",
] as const;

export default function MensSabiasQScreen() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const filteredDatos = query ? DATOS_KEYS.filter((k) => t(k).toLowerCase().includes(query)) : DATOS_KEYS;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ButtonInfoHeader title={t("sabiasQueTitulo")} searchValue={search} onSearchChange={setSearch} />

      <ScrollView style={globalStyles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <SpeakableText
          text={t("cuandoCambiaPeriodoTitulo")}
          style={[globalStyles.label, { marginTop: 12 }]}
          iconSize={14}
        />

        {filteredDatos.length === 0 && (
          <Text style={globalStyles.textNormal}>Sin resultados</Text>
        )}

        {filteredDatos.map((k) => (
          <View key={k} style={styles.row}>
            <View style={styles.arrowCircle}>
              <Ionicons name="arrow-forward" size={16} color={colors.text} />
            </View>
            <SpeakableText text={t(k)} style={[globalStyles.textNormal, styles.rowText]} iconSize={13} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
  },
  arrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: colors.text,
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: { flex: 1, minWidth: 0 },
});