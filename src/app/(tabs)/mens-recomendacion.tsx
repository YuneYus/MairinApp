import { useLanguage } from "@/contexts/LanguageContext";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import ButtonInfoHeader from "@/components/buttonInfoHeader";
import SpeakableText from "@/components/SpeakableText";
import { colors, globalStyles } from "@/styles/global";

const RECUERDA_KEYS = ["recuerda1","recuerda2","recuerda3","recuerda4","recuerda5","recuerda6","recuerda7"] as const;
const EVITA_KEYS = ["evita1","evita2","evita3","evita4","evita5","evita6","evita7"] as const;

export default function MensRecomendacionScreen() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const filteredRecuerda = query ? RECUERDA_KEYS.filter((k) => t(k).toLowerCase().includes(query)) : RECUERDA_KEYS;
  const filteredEvita = query ? EVITA_KEYS.filter((k) => t(k).toLowerCase().includes(query)) : EVITA_KEYS;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ButtonInfoHeader title={t("recomendacionesTitulo")} searchValue={search} onSearchChange={setSearch} />

      <ScrollView style={globalStyles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        {filteredRecuerda.length > 0 && (
          <>
            <SpeakableText
              text={t("recuerdaTitulo")}
              style={[globalStyles.label, { marginTop: 12 }]}
              iconSize={14}
            />
            {filteredRecuerda.map((k) => (
              <View key={k} style={styles.row}>
                <Ionicons name="checkmark-circle" size={22} color={colors.text} />
                <SpeakableText text={t(k)} style={[globalStyles.textNormal, styles.rowText]} iconSize={13} />
              </View>
            ))}
          </>
        )}

        {filteredEvita.length > 0 && (
          <>
            <SpeakableText
              text={t("evitaTitulo")}
              style={[globalStyles.label, { marginTop: 20 }]}
              iconSize={14}
            />
            {filteredEvita.map((k) => (
              <View key={k} style={styles.row}>
                <Ionicons name="close-circle" size={22} color="#C0392B" />
                <SpeakableText text={t(k)} style={[globalStyles.textNormal, styles.rowText]} iconSize={13} />
              </View>
            ))}
          </>
        )}

        {filteredRecuerda.length === 0 && filteredEvita.length === 0 && (
          <Text style={[globalStyles.textNormal, { marginTop: 20 }]}>Sin resultados</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
  },
  rowText: { flex: 1, minWidth: 0 },
});