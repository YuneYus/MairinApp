import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import ButtonCenterCard from "@/components/buttonCenterCard";
import ButtonInfoHeader from "@/components/buttonInfoHeader";
import SpeakableText from "@/components/SpeakableText";
import { colors, globalStyles } from "@/styles/global";

const RECOMENDADOS = [
  { titleKey: "ejercicio1Titulo", textKey: "ejercicio1Texto" },
  { titleKey: "ejercicio2Titulo", textKey: "ejercicio2Texto" },
  { titleKey: "ejercicio3Titulo", textKey: "ejercicio3Texto" },
  { titleKey: "ejercicio4Titulo", textKey: "ejercicio4Texto" },
  { titleKey: "ejercicio5Titulo", textKey: "ejercicio5Texto" },
] as const;

const PRECAUCION_KEYS = ["precaucion1", "precaucion2", "precaucion3", "precaucion4"] as const;

export default function MensEjercicioScreen() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const filteredRecomendados = query
    ? RECOMENDADOS.filter((r) => [t(r.titleKey), t(r.textKey)].join(" ").toLowerCase().includes(query))
    : RECOMENDADOS;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ButtonInfoHeader title={t("ejercicio")} searchValue={search} onSearchChange={setSearch} />

      <ScrollView style={globalStyles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        {!query && (
          <ButtonCenterCard>
            <SpeakableText text={t("introduccionEjercicio")} style={globalStyles.cardTitle} iconSize={14} />
            <SpeakableText
              text={t("ejercicioMenstruacionTexto")}
              style={[globalStyles.textNormal, { marginTop: 8 }]}
              iconSize={13}
            />
          </ButtonCenterCard>
        )}

        <SpeakableText
          text={t("ejerciciosRecomendadosTitulo")}
          style={[globalStyles.label, { marginTop: 20 }]}
          iconSize={14}
        />

        {filteredRecomendados.length === 0 && (
          <Text style={globalStyles.textNormal}>Sin resultados</Text>
        )}

        {filteredRecomendados.map((r) => (
          <ButtonCenterCard key={r.titleKey}>
            <SpeakableText text={t(r.titleKey)} style={globalStyles.cardTitle} iconSize={13} />
            <SpeakableText text={t(r.textKey)} style={globalStyles.textNormal} iconSize={12} />
          </ButtonCenterCard>
        ))}

        {!query && (
          <>
            <SpeakableText
              text={t("ejerciciosPrecaucionTitulo")}
              style={[globalStyles.label, { marginTop: 20 }]}
              iconSize={14}
            />

            <ButtonCenterCard>
              <SpeakableText text={t("ejerciciosPrecaucionTexto")} style={globalStyles.textNormal} iconSize={13} />
              {PRECAUCION_KEYS.map((k) => (
                <View key={k} style={{ marginTop: 10 }}>
                  <SpeakableText text={t(k)} style={globalStyles.textNormal} iconSize={12} />
                </View>
              ))}
            </ButtonCenterCard>

            <ButtonCenterCard>
              <SpeakableText text={t("ejerciciosPrecaucionFinal")} style={globalStyles.textNormal} iconSize={13} />
            </ButtonCenterCard>
          </>
        )}
      </ScrollView>
    </View>
  );
}