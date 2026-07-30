import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import ButtonCenterBulletList from "@/components/buttonCenterBulletList";
import ButtonCenterCard from "@/components/buttonCenterCard";
import ButtonInfoHeader from "@/components/buttonInfoHeader";
import SpeakableText from "@/components/SpeakableText";
import { colors, globalStyles } from "@/styles/global";

const SENALES_KEYS = [
  "senalSangradoVaginal",
  "senalPerdidaLiquido",
  "senalDolorAbdominal",
  "senalDolorCabeza",
  "senalCambiosVision",
  "senalDificultadRespirar",
  "senalDolorPecho",
  "senalFiebre",
  "senalHinchazon",
  "senalMovimientoBebe",
  "senalPensamientosDano",
] as const;

const ACTIVIDAD_KEYS = ["actividadHidratada", "actividadEvitaCalor", "actividadDetente"] as const;

export default function EmbarazoFactoresRiesgoScreen() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const filteredSenales = query
    ? SENALES_KEYS.filter((k) => t(k).toLowerCase().includes(query))
    : SENALES_KEYS;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ButtonInfoHeader
        title={t("factoresRiesgo")}
        searchValue={search}
        onSearchChange={setSearch}
      />

      <ScrollView style={globalStyles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        {!query && (
          <ButtonCenterCard>
            <SpeakableText text={t("escuchaCuerpoTitulo")} style={globalStyles.cardTitle} iconSize={14} />
            <SpeakableText
              text={t("escuchaCuerpoTexto")}
              style={[globalStyles.textNormal, { marginTop: 8 }]}
              iconSize={13}
            />
          </ButtonCenterCard>
        )}

        <View style={{ marginTop: 20 }}>
          <SpeakableText text={t("senalesAlarmaTitulo")} style={globalStyles.label} iconSize={14} />
          {filteredSenales.length === 0 ? (
            <Text style={globalStyles.textNormal}>Sin resultados</Text>
          ) : (
            <ButtonCenterBulletList items={filteredSenales.map((k) => t(k))} />
          )}
        </View>

        {!query && (
          <ButtonCenterCard>
            <SpeakableText text={t("cuidaCuerpoTitulo")} style={globalStyles.cardTitle} iconSize={14} />
            <SpeakableText
              text={t("cuidaCuerpoTexto")}
              style={[globalStyles.textNormal, { marginTop: 8 }]}
              iconSize={13}
            />

            <Text style={[globalStyles.label, { marginTop: 12 }]}>Durante la actividad:</Text>
            <ButtonCenterBulletList items={ACTIVIDAD_KEYS.map((k) => t(k))} />

            <SpeakableText
              text={t("actividadAdvertencia")}
              style={[globalStyles.textNormal, { marginTop: 12 }]}
              iconSize={13}
            />
          </ButtonCenterCard>
        )}
      </ScrollView>
    </View>
  );
}