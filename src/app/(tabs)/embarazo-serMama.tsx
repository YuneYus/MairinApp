import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import ButtonCenterBulletList from "@/components/buttonCenterBulletList";
import ButtonCenterCard from "@/components/buttonCenterCard";
import ButtonInfoHeader from "@/components/buttonInfoHeader";
import SpeakableText from "@/components/SpeakableText";
import { colors, globalStyles } from "@/styles/global";

// NOTE: these three bullet lists appear in the mockup but have no matching
// translation keys in translations/index.ts — only the paragraph-level
// *Texto keys exist. Left hardcoded in Spanish until dedicated keys are
// added (so they also won't be part of the search filter below).
const SENTIMIENTOS_ITEMS = [
  "Amor",
  "Felicidad",
  "Preocupación",
  "Cansancio",
  "Miedo o incertidumbre",
  "A veces varias emociones al mismo tiempo",
];

const IDENTIDAD_ITEMS = [
  "Necesitar descansar",
  "Extrañar tu rutina anterior",
  "Sentir miedo",
  "Querer tiempo para ti",
  "Necesitar ayuda",
  "Continuar teniendo metas y proyectos propios",
];

const APOYO_ITEMS = [
  "Preparar alimentos",
  "Realizar tareas del hogar",
  "Acompañarte a una cita",
  "Cuidar al bebé mientras descansas",
  "Hablar sobre cómo te estás sintiendo",
];

export default function EmbarazoSerMamaScreen() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const sectionMatches = (...texts: string[]) =>
    !query || texts.join(" ").toLowerCase().includes(query);

  const showIntro = sectionMatches(t("serMamaTexto"), ...SENTIMIENTOS_ITEMS);
  const showCuerpo = sectionMatches(t("cuerpoNecesitaTiempoTitulo"), t("cuerpoNecesitaTiempoTexto"));
  const showAyuda = sectionMatches(t("pedirAyudaTitulo"), t("pedirAyudaTexto"), ...APOYO_ITEMS);
  const showEmocional = sectionMatches(t("bienestarEmocionalTitulo"), t("bienestarEmocionalTexto"));
  const showIdentidad = sectionMatches(t("identidadMamaTitulo"), t("identidadMamaTexto"), ...IDENTIDAD_ITEMS);

  const noResults = query && !showIntro && !showCuerpo && !showAyuda && !showEmocional && !showIdentidad;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ButtonInfoHeader
        title={t("serMamaTitulo")}
        searchValue={search}
        onSearchChange={setSearch}
      />

      <ScrollView style={globalStyles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        {noResults && <Text style={[globalStyles.textNormal, { marginTop: 20 }]}>Sin resultados</Text>}

        {showIntro && (
          <ButtonCenterCard>
            <SpeakableText text={t("serMamaTexto")} style={globalStyles.textNormal} iconSize={13} />
            <ButtonCenterBulletList items={SENTIMIENTOS_ITEMS} />
          </ButtonCenterCard>
        )}

        {showCuerpo && (
          <ButtonCenterCard>
            <SpeakableText text={t("cuerpoNecesitaTiempoTitulo")} style={globalStyles.cardTitle} iconSize={14} />
            <SpeakableText
              text={t("cuerpoNecesitaTiempoTexto")}
              style={[globalStyles.textNormal, { marginTop: 8 }]}
              iconSize={13}
            />
          </ButtonCenterCard>
        )}

        {showAyuda && (
          <ButtonCenterCard>
            <SpeakableText text={t("pedirAyudaTitulo")} style={globalStyles.cardTitle} iconSize={14} />
            <SpeakableText
              text={t("pedirAyudaTexto")}
              style={[globalStyles.textNormal, { marginTop: 8 }]}
              iconSize={13}
            />
            <Text style={[globalStyles.label, { marginTop: 12 }]}>Puedes pedir apoyo para:</Text>
            <ButtonCenterBulletList items={APOYO_ITEMS} />
          </ButtonCenterCard>
        )}

        {showEmocional && (
          <ButtonCenterCard>
            <SpeakableText text={t("bienestarEmocionalTitulo")} style={globalStyles.cardTitle} iconSize={14} />
            <SpeakableText
              text={t("bienestarEmocionalTexto")}
              style={[globalStyles.textNormal, { marginTop: 8 }]}
              iconSize={13}
            />
          </ButtonCenterCard>
        )}

        {showIdentidad && (
          <ButtonCenterCard>
            <SpeakableText text={t("identidadMamaTitulo")} style={globalStyles.cardTitle} iconSize={14} />
            <Text style={[globalStyles.textNormal, { marginTop: 8 }]}>
              Puedes amar a tu bebé y al mismo tiempo:
            </Text>
            <ButtonCenterBulletList items={IDENTIDAD_ITEMS} />
            <SpeakableText
              text={t("identidadMamaTexto")}
              style={[globalStyles.textNormal, { marginTop: 12 }]}
              iconSize={13}
            />
          </ButtonCenterCard>
        )}
      </ScrollView>
    </View>
  );
}