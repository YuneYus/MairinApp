

import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import ButtonCenterBulletList from "@/components/buttonCenterBulletList";
import ButtonCenterCard from "@/components/buttonCenterCard";
import ButtonInfoHeader from "@/components/buttonInfoHeader";
import SpeakableText from "@/components/SpeakableText";
import { colors, globalStyles } from "@/styles/global";

const FISICO_ITEMS = ["menopausiaFisicoBochornosIntensos","menopausiaFisicoSudoraciones","menopausiaFisicoPalpitaciones","menopausiaFisicoSequedadVaginal","menopausiaFisicoArdorVaginal","menopausiaFisicoLubricacion","menopausiaFisicoDolorRelaciones","menopausiaFisicoInfecciones","menopausiaFisicoPiel","menopausiaFisicoCabello","menopausiaFisicoUnas","menopausiaFisicoPeso"] as const;
const PSICO_ITEMS = ["menopausiaPsicoHumor","menopausiaPsicoAnsiedad","menopausiaPsicoTristeza","menopausiaPsicoAutoestima","menopausiaPsicoIrritabilidad","menopausiaPsicoDormir","menopausiaPsicoConcentrarse","menopausiaPsicoOlvidos","menopausiaPsicoEnergia"] as const;
const ALIMENTACION_ITEMS = ["menopausiaAlimentacionCalcio","menopausiaAlimentacionProteina","menopausiaAlimentacionAzucar","menopausiaAlimentacionAgua"] as const;
const ACTIVIDAD_ITEMS = ["menopausiaActividadFuerza","menopausiaActividadCaminar","menopausiaActividadEquilibrio"] as const;
const SALUD_INTIMA_ITEMS = ["saludIntimaSequedad","saludIntimaDolor","saludIntimaHigiene"] as const;
const BIENESTAR_ITEMS = ["menopausiaBienestarDescanso","menopausiaBienestarActividades","menopausiaBienestarApoyo"] as const;
const SALUD_ITEMS = ["menopausiaSaludChequeos","menopausiaSaludHablaMedico"] as const;

export default function MenoMenopausiaScreen() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const matches = (...texts: string[]) => !query || texts.join(" ").toLowerCase().includes(query);

  const showFisico = matches(t("sintomasFisicosTitulo"), ...FISICO_ITEMS.map((k) => t(k)));
  const showPsico = matches(t("sintomasPsicologicosTitulo"), ...PSICO_ITEMS.map((k) => t(k)));
  const showFrase = matches(t("menopausiaFrase"));
  const showAlimentacion = matches(t("alimentacionTitulo"), ...ALIMENTACION_ITEMS.map((k) => t(k)));
  const showActividad = matches(t("actividadFisicaTitulo"), ...ACTIVIDAD_ITEMS.map((k) => t(k)));
  const showSaludIntima = matches(t("saludIntimaTitulo"), ...SALUD_INTIMA_ITEMS.map((k) => t(k)));
  const showBienestar = matches(t("bienestarEmocionalTitulo"), ...BIENESTAR_ITEMS.map((k) => t(k)));
  const showSalud = matches(t("saludTitulo"), ...SALUD_ITEMS.map((k) => t(k)));

  const noResults = query && !showFisico && !showPsico && !showAlimentacion && !showActividad && !showSaludIntima && !showBienestar && !showSalud;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ButtonInfoHeader title={t("menopausiaTitulo")} searchValue={search} onSearchChange={setSearch} />

      <ScrollView style={globalStyles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        {!query && (
          <ButtonCenterCard>
            <SpeakableText text={t("menopausiaConfirmacion")} style={globalStyles.textNormal} iconSize={13} />
            <SpeakableText text={t("menopausiaMomento")} style={[globalStyles.textNormal, { marginTop: 6 }]} iconSize={13} />
          </ButtonCenterCard>
        )}

        {noResults && <Text style={[globalStyles.textNormal, { marginTop: 20 }]}>Sin resultados</Text>}

        {showFisico && (
          <>
            <SpeakableText text={t("sintomasFisicosTitulo")} style={[globalStyles.label, { marginTop: 20 }]} iconSize={14} />
            <ButtonCenterCard>
              {!query && <SpeakableText text={t("menopausiaSintomasIntro")} style={[globalStyles.textNormal, { marginBottom: 8 }]} iconSize={13} />}
              <Text style={globalStyles.label}>Ejemplos:</Text>
              <ButtonCenterBulletList items={FISICO_ITEMS.map((k) => t(k))} />
            </ButtonCenterCard>
          </>
        )}

        {showPsico && (
          <>
            <SpeakableText text={t("sintomasPsicologicosTitulo")} style={[globalStyles.label, { marginTop: 20 }]} iconSize={14} />
            <ButtonCenterCard>
              <Text style={globalStyles.label}>Ejemplos:</Text>
              <ButtonCenterBulletList items={PSICO_ITEMS.map((k) => t(k))} />
            </ButtonCenterCard>
          </>
        )}

        {showFrase && (
          <ButtonCenterCard style={{ borderColor: colors.text, borderWidth: 1.5, marginTop: 20 }}>
            <SpeakableText text={t("menopausiaFrase")} style={globalStyles.textNormal} iconSize={13} />
          </ButtonCenterCard>
        )}

        {showAlimentacion && (
          <>
            <SpeakableText text={t("alimentacionTitulo")} style={[globalStyles.label, { marginTop: 20 }]} iconSize={14} />
            <ButtonCenterCard><ButtonCenterBulletList items={ALIMENTACION_ITEMS.map((k) => t(k))} /></ButtonCenterCard>
          </>
        )}

        {showActividad && (
          <>
            <SpeakableText text={t("actividadFisicaTitulo")} style={[globalStyles.label, { marginTop: 20 }]} iconSize={14} />
            <ButtonCenterCard><ButtonCenterBulletList items={ACTIVIDAD_ITEMS.map((k) => t(k))} /></ButtonCenterCard>
          </>
        )}

        {showSaludIntima && (
          <>
            <SpeakableText text={t("saludIntimaTitulo")} style={[globalStyles.label, { marginTop: 20 }]} iconSize={14} />
            <ButtonCenterCard><ButtonCenterBulletList items={SALUD_INTIMA_ITEMS.map((k) => t(k))} /></ButtonCenterCard>
          </>
        )}

        {showBienestar && (
          <>
            <SpeakableText text={t("bienestarEmocionalTitulo")} style={[globalStyles.label, { marginTop: 20 }]} iconSize={14} />
            <ButtonCenterCard><ButtonCenterBulletList items={BIENESTAR_ITEMS.map((k) => t(k))} /></ButtonCenterCard>
          </>
        )}

        {showSalud && (
          <>
            <SpeakableText text={t("saludTitulo")} style={[globalStyles.label, { marginTop: 20 }]} iconSize={14} />
            <ButtonCenterCard><ButtonCenterBulletList items={SALUD_ITEMS.map((k) => t(k))} /></ButtonCenterCard>
          </>
        )}
      </ScrollView>
    </View>
  );
}