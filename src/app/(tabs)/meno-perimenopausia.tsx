

import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import ButtonCenterBulletList from "@/components/buttonCenterBulletList";
import ButtonCenterCard from "@/components/buttonCenterCard";
import ButtonInfoHeader from "@/components/buttonInfoHeader";
import SpeakableText from "@/components/SpeakableText";
import { colors, globalStyles } from "@/styles/global";

const SINTOMA_GROUPS = [
  { titleKey: "menstruacionTitulo", items: ["menstruacionCiclosIrregulares","menstruacionAbundanteLigera","menstruacionSangradosLargosCortos","menstruacionMesesSin"] },
  { titleKey: "vasomotoresTitulo", items: ["vasomotoresBochornos","vasomotoresCalor","vasomotoresSudoracion","vasomotoresEnrojecimiento"] },
  { titleKey: "suenoTitulo", items: ["suenoInsomnio","suenoDespertares","suenoLigero"] },
  { titleKey: null, items: ["otrosSintomasFatiga","otrosSintomasDoloresMusculares","otrosSintomasDolorArticulaciones","otrosSintomasSensibilidadSenos","otrosSintomasMigranas","otrosSintomasAumentoPeso"] },
  { titleKey: "saludSexualTitulo", items: ["saludSexualDeseo","saludSexualSequedad","saludSexualRelacionesIncomodas"] },
] as const;

const PSICO_ITEMS = ["psicoAnsiedad","psicoIrritabilidad","psicoCambiosHumor","psicoTristeza","psicoSensibilidadEmocional","psicoDificultadConcentrarse","psicoNieblaMental","psicoSensacionDiferente","psicoEstres"] as const;

const ALIMENTACION_ITEMS = ["alimentacionCalcio","alimentacionVitaminaD","alimentacionFrutasVerduras","alimentacionReduceCafeina","alimentacionHidratada"] as const;
const ACTIVIDAD_ITEMS = ["actividadCaminaTitulo","actividadFuerza","actividadEstiramientos"] as const;
const BIENESTAR_ITEMS = ["bienestarHabla","bienestarRespiracion","bienestarHormonas"] as const;
const DESCANSO_ITEMS = ["descansoHorario","descansoPantallas","descansoHabitacionFresca"] as const;
const SALUD_ITEMS = ["saludRegistro","saludChequeos","saludConsultaSangrado"] as const;

export default function MenoPerimenopausiaScreen() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const matches = (...texts: string[]) => !query || texts.join(" ").toLowerCase().includes(query);

  const filteredSintomaGroups = SINTOMA_GROUPS.filter((g) =>
    matches(...(g.titleKey ? [t(g.titleKey as any)] : []), ...g.items.map((i) => t(i as any)))
  );
  const showPsico = matches(t("sintomasPsicologicosTitulo"), t("sintomasPsicologicosIntro"), ...PSICO_ITEMS.map((k) => t(k)));
  const showFrase = matches(t("perimenopausiaFrase"));
  const showAlimentacion = matches(...ALIMENTACION_ITEMS.map((k) => t(k)));
  const showActividad = matches(t("actividadFisicaTitulo"), ...ACTIVIDAD_ITEMS.map((k) => t(k)));
  const showBienestar = matches(...BIENESTAR_ITEMS.map((k) => t(k)));
  const showDescanso = matches(t("descansoTitulo"), ...DESCANSO_ITEMS.map((k) => t(k)));
  const showSalud = matches(t("saludTitulo"), ...SALUD_ITEMS.map((k) => t(k)));

  const noResults = query && filteredSintomaGroups.length === 0 && !showPsico && !showAlimentacion && !showActividad && !showBienestar && !showDescanso && !showSalud;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ButtonInfoHeader title={t("perimenopausiaTitulo")} searchValue={search} onSearchChange={setSearch} />

      <ScrollView style={globalStyles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        {!query && (
          <ButtonCenterCard>
            <SpeakableText text={t("perimenopausiaIntro")} style={globalStyles.textNormal} iconSize={13} />
          </ButtonCenterCard>
        )}

        {noResults && <Text style={[globalStyles.textNormal, { marginTop: 20 }]}>Sin resultados</Text>}

        {filteredSintomaGroups.length > 0 && (
          <SpeakableText text={t("sintomasFisicosTitulo")} style={[globalStyles.label, { marginTop: 20 }]} iconSize={14} />
        )}

        {filteredSintomaGroups.map((g, idx) => (
          <ButtonCenterCard key={idx}>
            {g.titleKey && <SpeakableText text={t(g.titleKey as any)} style={globalStyles.cardTitle} iconSize={13} />}
            <ButtonCenterBulletList items={g.items.map((i) => t(i as any))} />
          </ButtonCenterCard>
        ))}

        {showPsico && (
          <ButtonCenterCard>
            <SpeakableText text={t("sintomasPsicologicosTitulo")} style={globalStyles.cardTitle} iconSize={14} />
            <SpeakableText text={t("sintomasPsicologicosIntro")} style={[globalStyles.textNormal, { marginTop: 6 }]} iconSize={13} />
            <Text style={[globalStyles.label, { marginTop: 8 }]}>Ejemplos:</Text>
            <ButtonCenterBulletList items={PSICO_ITEMS.map((k) => t(k))} />
          </ButtonCenterCard>
        )}

        {showFrase && (
          <ButtonCenterCard style={{ borderColor: colors.text, borderWidth: 1.5 }}>
            <SpeakableText text={t("perimenopausiaFrase")} style={globalStyles.textNormal} iconSize={13} />
          </ButtonCenterCard>
        )}

        {showAlimentacion && (
          <>
            <SpeakableText text={t("alimentacionTitulo")} style={[globalStyles.label, { marginTop: 20 }]} iconSize={14} />
            <ButtonCenterCard>
              <ButtonCenterBulletList items={ALIMENTACION_ITEMS.map((k) => t(k))} />
            </ButtonCenterCard>
          </>
        )}

        {showActividad && (
          <>
            <SpeakableText text={t("actividadFisicaTitulo")} style={[globalStyles.label, { marginTop: 20 }]} iconSize={14} />
            <ButtonCenterCard>
              <ButtonCenterBulletList items={ACTIVIDAD_ITEMS.map((k) => t(k))} />
            </ButtonCenterCard>
          </>
        )}

        {showBienestar && (
          <>
            <SpeakableText text={t("bienestarEmocionalTitulo")} style={[globalStyles.label, { marginTop: 20 }]} iconSize={14} />
            <ButtonCenterCard>
              <ButtonCenterBulletList items={BIENESTAR_ITEMS.map((k) => t(k))} />
            </ButtonCenterCard>
          </>
        )}

        {showDescanso && (
          <>
            <SpeakableText text={t("descansoTitulo")} style={[globalStyles.label, { marginTop: 20 }]} iconSize={14} />
            <ButtonCenterCard>
              <ButtonCenterBulletList items={DESCANSO_ITEMS.map((k) => t(k))} />
            </ButtonCenterCard>
          </>
        )}

        {showSalud && (
          <>
            <SpeakableText text={t("saludTitulo")} style={[globalStyles.label, { marginTop: 20 }]} iconSize={14} />
            <ButtonCenterCard>
              <ButtonCenterBulletList items={SALUD_ITEMS.map((k) => t(k))} />
            </ButtonCenterCard>
          </>
        )}
      </ScrollView>
    </View>
  );
}