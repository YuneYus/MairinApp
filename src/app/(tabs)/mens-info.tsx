import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import ButtonCenterBulletList from "@/components/buttonCenterBulletList";
import ButtonCenterCard from "@/components/buttonCenterCard";
import ButtonInfoHeader from "@/components/buttonInfoHeader";
import SpeakableText from "@/components/SpeakableText";
import { colors, globalStyles } from "@/styles/global";

const CAMBIO_KEYS = [
  "cambioPeriodo1", "cambioPeriodo2", "cambioPeriodo3", "cambioPeriodo4",
  "cambioPeriodo5", "cambioPeriodo6", "cambioPeriodo7", "cambioPeriodo8", "cambioPeriodo9",
] as const;

export default function MensInfoScreen() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const filteredCambios = query
    ? CAMBIO_KEYS.filter((k) => t(k).toLowerCase().includes(query))
    : CAMBIO_KEYS;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ButtonInfoHeader title={t("Menstruación")} searchValue={search} onSearchChange={setSearch} />

      <ScrollView style={globalStyles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        {!query && (
          <>
            <ButtonCenterCard>
              <SpeakableText text={t("aprenderMenstruacion")} style={globalStyles.cardTitle} iconSize={14} />
            </ButtonCenterCard>

            <ButtonCenterCard>
              <SpeakableText text={t("queEsMenstruacionTitulo")} style={globalStyles.label} iconSize={14} />
              <SpeakableText text={t("queEsMenstruacionTexto")} style={globalStyles.textNormal} iconSize={13} />
            </ButtonCenterCard>

            <ButtonCenterCard>
              <SpeakableText text={t("porqueOcurreTitulo")} style={globalStyles.label} iconSize={14} />
              <ButtonCenterBulletList
                items={[
                  t("porqueOcurre1"),
                  t("porqueOcurre2"),
                  t("porqueOcurre3"),
                  t("porqueOcurre4"),
                ]}
              />
            </ButtonCenterCard>

            <ButtonCenterCard>
              <SpeakableText text={t("cuandoComienzaTitulo")} style={globalStyles.label} iconSize={14} />
              <SpeakableText text={t("cuandoComienzaTexto")} style={globalStyles.textNormal} iconSize={13} />
            </ButtonCenterCard>

            <ButtonCenterCard>
              <SpeakableText text={t("sintomasNormalesTitulo")} style={globalStyles.label} iconSize={14} />
              <ButtonCenterBulletList
                items={[
                  t("sintoma1"), t("sintoma2"), t("sintoma3"), t("sintoma4"),
                  t("sintoma5"), t("sintoma6"), t("sintoma7"), t("sintoma8"),
                ]}
              />
            </ButtonCenterCard>

            <ButtonCenterCard style={{ borderColor: colors.text, borderWidth: 1.5 }}>
              <SpeakableText text={t("cuandoIrDoctorTitulo")} style={globalStyles.label} iconSize={14} />
              <ButtonCenterBulletList
                items={[
                  t("doctor1"), t("doctor2"), t("doctor3"), t("doctor4"), t("doctor5"),
                ]}
              />
            </ButtonCenterCard>
          </>
        )}

        <SpeakableText
          text={t("cuandoCambiaPeriodoTitulo")}
          style={[globalStyles.label, { marginTop: 20 }]}
          iconSize={14}
        />

        {filteredCambios.length === 0 && (
          <Text style={globalStyles.textNormal}>Sin resultados</Text>
        )}

        {filteredCambios.map((k) => (
          <ButtonCenterCard key={k}>
            <SpeakableText text={t(k)} style={globalStyles.textNormal} iconSize={12} />
          </ButtonCenterCard>
        ))}
      </ScrollView>
    </View>
  );
}