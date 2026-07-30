import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import ButtonCenterBulletList from "@/components/buttonCenterBulletList";
import ButtonCenterCard from "@/components/buttonCenterCard";
import ButtonInfoHeader from "@/components/buttonInfoHeader";
import SpeakableText from "@/components/SpeakableText";
import { colors, globalStyles } from "@/styles/global";

const ETAPAS = [
  { titleKey: "etapa1Titulo", textKey: "etapa1Texto" },
  { titleKey: "etapa2Titulo", textKey: "etapa2Texto" },
  { titleKey: "etapa3Titulo", textKey: "etapa3Texto" },
] as const;

const PREPARAR_KEYS = [
  "prepararOpcionesDolor",
  "prepararPosicionesParto",
  "prepararAcompanante",
  "prepararCuandoAcudir",
  "prepararContracciones",
  "prepararDocumentos",
] as const;

const DURANTE_KEYS = [
  "respiraTecnicas",
  "cambiaPosicionSegura",
  "escuchaIndicaciones",
  "comunicaComoTeSientes",
  "preguntaSiNoComprendes",
  "pideApoyo",
] as const;

export default function EmbarazoPrepPartoScreen() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const filteredEtapas = query
    ? ETAPAS.filter((e) => [t(e.titleKey), t(e.textKey)].join(" ").toLowerCase().includes(query))
    : ETAPAS;

  const filteredPreparar = query
    ? PREPARAR_KEYS.filter((k) => t(k).toLowerCase().includes(query))
    : PREPARAR_KEYS;

  const filteredDurante = query
    ? DURANTE_KEYS.filter((k) => t(k).toLowerCase().includes(query))
    : DURANTE_KEYS;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ButtonInfoHeader
        title={t("prepararParto")}
        searchValue={search}
        onSearchChange={setSearch}
      />

      <ScrollView style={globalStyles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        {!query && (
          <ButtonCenterCard>
            <SpeakableText text={t("prepararParto")} style={globalStyles.cardTitle} iconSize={14} />
            <SpeakableText
              text={t("preparandoPartoTexto")}
              style={[globalStyles.textNormal, { marginTop: 8 }]}
              iconSize={13}
            />
          </ButtonCenterCard>
        )}

        {filteredEtapas.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <SpeakableText text={t("etapasPartoTitulo")} style={globalStyles.label} iconSize={14} />

            {filteredEtapas.map((etapa, i) => (
              <View key={etapa.titleKey} style={styles.etapaRow}>
                <View style={styles.etapaCircle}>
                  <Text style={styles.etapaNumber}>{ETAPAS.indexOf(etapa) + 1}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={globalStyles.label}>{t(etapa.titleKey)}</Text>
                  <SpeakableText text={t(etapa.textKey)} style={globalStyles.textNormal} iconSize={13} />
                </View>
              </View>
            ))}
          </View>
        )}

        {!query && (
          <ButtonCenterCard>
            <SpeakableText text={t("movimientoPosicionesTitulo")} style={globalStyles.cardTitle} iconSize={14} />
            <SpeakableText
              text={t("movimientoPosicionesTexto")}
              style={[globalStyles.textNormal, { marginTop: 8 }]}
              iconSize={13}
            />
          </ButtonCenterCard>
        )}

        {filteredPreparar.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <SpeakableText text={t("comoPrepararmeTitulo")} style={globalStyles.label} iconSize={14} />
            <ButtonCenterBulletList items={filteredPreparar.map((k) => t(k))} />
            {!query && (
              <SpeakableText
                text={t("planPartoNota")}
                style={[globalStyles.textNormal, { marginTop: 8 }]}
                iconSize={13}
              />
            )}
          </View>
        )}

        {filteredDurante.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <SpeakableText text={t("duranteTrabajoPartoTitulo")} style={globalStyles.label} iconSize={14} />
            <ButtonCenterBulletList items={filteredDurante.map((k) => t(k))} />
          </View>
        )}

        {query && filteredEtapas.length === 0 && filteredPreparar.length === 0 && filteredDurante.length === 0 && (
          <Text style={[globalStyles.textNormal, { marginTop: 20 }]}>Sin resultados</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  etapaRow: { flexDirection: "row", gap: 12, marginTop: 14, alignItems: "flex-start" },
  etapaCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  etapaNumber: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 15,
    color: colors.text,
  },
});