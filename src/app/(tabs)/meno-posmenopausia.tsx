

import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import ButtonCenterBulletList from "@/components/buttonCenterBulletList";
import ButtonCenterCard from "@/components/buttonCenterCard";
import ButtonInfoHeader from "@/components/buttonInfoHeader";
import SpeakableText from "@/components/SpeakableText";
import { colors, globalStyles } from "@/styles/global";

const FISICO_ITEMS = ["posFisicoSequedad","posFisicoLubricacion","posFisicoDolor","posFisicoElasticidad","posFisicoIncontinencia","posFisicoInfecciones"] as const;

const CAMBIO_GROUPS = [
  { titleKey: "huesosTitulo", items: ["huesosPerdidaMasa", "huesosOsteopenia", "huesosOsteoporosis"] },
  { titleKey: "corazonTitulo", items: ["corazonRiesgo", "corazonColesterol"] },
  { titleKey: "musculosTitulo", items: ["musculosDisminucion", "musculosDebilidad"] },
  { titleKey: "metabolismoTitulo", items: ["metabolismoPeso", "metabolismoGrasa"] },
  { titleKey: "pielTitulo", items: ["pielColageno", "pielSeca", "pielArrugas"] },
] as const;

const PSICO_ITEMS = ["posPsicoAnsiedad","posPsicoDepresion","posPsicoAutoestima","posPsicoHumor","posPsicoNiebla","posPsicoConfianza","posPsicoEnvejecimiento"] as const;
const ALIMENTACION_ITEMS = ["posAlimentacionCalcio","posAlimentacionFibra","posAlimentacionSal"] as const;
const ACTIVIDAD_ITEMS = ["posActividadFuerza","posActividadCaminar","posActividadEquilibrio"] as const;
const SALUD_OSEA_ITEMS = ["saludOseaEvaluacion","saludOseaTabaco"] as const;
const SALUD_CARDIO_ITEMS = ["saludCardiovascularPresion","saludCardiovascularPeso","saludCardiovascularConsulta"] as const;
const BIENESTAR_ITEMS = ["posBienestarSocial","posBienestarTiempo","posBienestarApoyo"] as const;

export default function MenoPosmenopausiaScreen() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const matches = (...texts: string[]) => !query || texts.join(" ").toLowerCase().includes(query);

  const showFisico = matches(...FISICO_ITEMS.map((k) => t(k)));
  const filteredCambios = CAMBIO_GROUPS.filter((g) => matches(t(g.titleKey), ...g.items.map((i) => t(i as any))));
  const showPsico = matches(...PSICO_ITEMS.map((k) => t(k)));
  const showFrase = matches(t("posmenopausiaFrase"));
  const showAlimentacion = matches(...ALIMENTACION_ITEMS.map((k) => t(k)));
  const showActividad = matches(...ACTIVIDAD_ITEMS.map((k) => t(k)));
  const showSaludOsea = matches(t("saludOseaTitulo"), ...SALUD_OSEA_ITEMS.map((k) => t(k)));
  const showSaludCardio = matches(t("saludCardiovascularTitulo"), ...SALUD_CARDIO_ITEMS.map((k) => t(k)));
  const showBienestar = matches(...BIENESTAR_ITEMS.map((k) => t(k)));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ButtonInfoHeader title={t("posmenopausiaTitulo")} searchValue={search} onSearchChange={setSearch} />

      <ScrollView style={globalStyles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        {!query && (
          <ButtonCenterCard>
            <SpeakableText text={t("posmenopausiaComienzo")} style={globalStyles.textNormal} iconSize={13} />
            <SpeakableText text={t("posmenopausiaNuevaEtapa")} style={[globalStyles.textNormal, { marginTop: 6 }]} iconSize={13} />
            <SpeakableText text={t("posmenopausiaBochornos")} style={[globalStyles.textNormal, { marginTop: 6 }]} iconSize={13} />
          </ButtonCenterCard>
        )}

        {showFisico && (
          <>
            <SpeakableText text={t("sintomasFisicosTitulo")} style={[globalStyles.label, { marginTop: 20 }]} iconSize={14} />
            <ButtonCenterCard>
              <Text style={globalStyles.label}>Ejemplos:</Text>
              <ButtonCenterBulletList items={FISICO_ITEMS.map((k) => t(k))} />
            </ButtonCenterCard>
          </>
        )}

        {filteredCambios.length > 0 && (
          <SpeakableText text={t("cambiosLargoPlazoTitulo")} style={[globalStyles.label, { marginTop: 20 }]} iconSize={14} />
        )}
        {filteredCambios.map((g) => (
          <ButtonCenterCard key={g.titleKey}>
            <SpeakableText text={t(g.titleKey)} style={globalStyles.cardTitle} iconSize={13} />
            <ButtonCenterBulletList items={g.items.map((i) => t(i as any))} />
          </ButtonCenterCard>
        ))}

        {showPsico && (
          <ButtonCenterCard>
            <SpeakableText text={t("sintomasPsicologicosTitulo")} style={globalStyles.cardTitle} iconSize={13} />
            <ButtonCenterBulletList items={PSICO_ITEMS.map((k) => t(k))} />
          </ButtonCenterCard>
        )}

        {showFrase && (
          <ButtonCenterCard style={{ borderColor: colors.text, borderWidth: 1.5 }}>
            <SpeakableText text={t("posmenopausiaFrase")} style={globalStyles.textNormal} iconSize={13} />
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

        {showSaludOsea && (
          <ButtonCenterCard>
            <SpeakableText text={t("saludOseaTitulo")} style={globalStyles.cardTitle} iconSize={13} />
            <ButtonCenterBulletList items={SALUD_OSEA_ITEMS.map((k) => t(k))} />
          </ButtonCenterCard>
        )}

        {showSaludCardio && (
          <ButtonCenterCard>
            <SpeakableText text={t("saludCardiovascularTitulo")} style={globalStyles.cardTitle} iconSize={13} />
            <ButtonCenterBulletList items={SALUD_CARDIO_ITEMS.map((k) => t(k))} />
          </ButtonCenterCard>
        )}

        {showBienestar && (
          <>
            <SpeakableText text={t("bienestarEmocionalTitulo")} style={[globalStyles.label, { marginTop: 20 }]} iconSize={14} />
            <ButtonCenterCard><ButtonCenterBulletList items={BIENESTAR_ITEMS.map((k) => t(k))} /></ButtonCenterCard>
          </>
        )}
      </ScrollView>
    </View>
  );
}