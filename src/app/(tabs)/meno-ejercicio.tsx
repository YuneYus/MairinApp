import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";

import ButtonCenterBulletList from "@/components/buttonCenterBulletList";
import ButtonCenterCard from "@/components/buttonCenterCard";
import ButtonInfoHeader from "@/components/buttonInfoHeader";
import SpeakableText from "@/components/SpeakableText";
import { colors, globalStyles } from "@/styles/global";

const EJERCICIOS = [
  {
    n: 1, titleKey: "ejercicioFuerzaTitulo", preguntaKey: "ejercicioFuerzaPregunta", textKey: "ejercicioFuerzaTexto",
    beneficios: ["ejercicioFuerzaBeneficios1","ejercicioFuerzaBeneficios2","ejercicioFuerzaBeneficios3","ejercicioFuerzaBeneficios4","ejercicioFuerzaBeneficios5"],
    ejemplos: ["ejercicioFuerzaEjemplo1","ejercicioFuerzaEjemplo2","ejercicioFuerzaEjemplo3","ejercicioFuerzaEjemplo4"],
    frecuenciaKey: "ejercicioFuerzaFrecuencia", videoKey: null,
  },
  {
    n: 2, titleKey: "ejercicioCaminataTitulo", preguntaKey: "ejercicioCaminataPregunta", textKey: "ejercicioCaminataTexto",
    beneficios: ["ejercicioCaminataBeneficios1","ejercicioCaminataBeneficios2","ejercicioCaminataBeneficios3","ejercicioCaminataBeneficios4","ejercicioCaminataBeneficios5"],
    ejemplos: [], frecuenciaKey: "ejercicioCaminataMeta", videoKey: null,
  },
  {
    n: 3, titleKey: "ejercicioYogaTitulo", preguntaKey: "ejercicioYogaPregunta", textKey: "ejercicioYogaTexto",
    beneficios: ["ejercicioYogaBeneficios1","ejercicioYogaBeneficios2","ejercicioYogaBeneficios3","ejercicioYogaBeneficios4"],
    ejemplos: [], frecuenciaKey: "ejercicioYogaFrecuencia", videoKey: "ejercicioYogaVideo",
  },
  {
    n: 4, titleKey: "ejercicioEquilibrioTitulo", preguntaKey: "ejercicioEquilibrioPregunta", textKey: "ejercicioEquilibrioTexto",
    beneficios: ["ejercicioEquilibrioBeneficios1","ejercicioEquilibrioBeneficios2","ejercicioEquilibrioBeneficios3","ejercicioEquilibrioBeneficios4"],
    ejemplos: ["ejercicioEquilibrioEjemplo1","ejercicioEquilibrioEjemplo2","ejercicioEquilibrioEjemplo3"],
    frecuenciaKey: "ejercicioEquilibrioFrecuencia", videoKey: "ejercicioEquilibrioVideo",
  },
  {
    n: 5, titleKey: "ejercicioCardioTitulo", preguntaKey: "ejercicioCardioPregunta", textKey: "ejercicioCardioTexto",
    beneficios: ["ejercicioCardioBeneficios1","ejercicioCardioBeneficios2","ejercicioCardioBeneficios3","ejercicioCardioBeneficios4"],
    ejemplos: ["ejercicioCardioOpcion1","ejercicioCardioOpcion2","ejercicioCardioOpcion3","ejercicioCardioOpcion4"],
    frecuenciaKey: "ejercicioCardioFrecuencia", videoKey: null,
  },
  {
    n: 6, titleKey: "ejercicioPelvicoTitulo", preguntaKey: "ejercicioPelvicoPregunta", textKey: "ejercicioPelvicoTexto",
    beneficios: ["ejercicioPelvicoBeneficios1","ejercicioPelvicoBeneficios2","ejercicioPelvicoBeneficios3","ejercicioPelvicoBeneficios4"],
    ejemplos: ["ejercicioPelvicoEjemplo"], frecuenciaKey: "ejercicioPelvicoFrecuencia", videoKey: "ejercicioPelvicoVideo",
  },
] as const;

export default function MenoEjercicioScreen() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const filtered = query
    ? EJERCICIOS.filter((e) =>
        [t(e.titleKey), t(e.textKey), ...e.beneficios.map((b) => t(b as any)), ...e.ejemplos.map((x) => t(x as any))]
          .join(" ")
          .toLowerCase()
          .includes(query)
      )
    : EJERCICIOS;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ButtonInfoHeader title={t("ejerciciosTitulo")} searchValue={search} onSearchChange={setSearch} />

      <ScrollView style={globalStyles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        {filtered.length === 0 && (
          <Text style={[globalStyles.textNormal, { marginTop: 20 }]}>Sin resultados</Text>
        )}

        {filtered.map((e) => (
          <ButtonCenterCard key={e.n}>
            <SpeakableText text={`${e.n}. ${t(e.titleKey)}`} style={globalStyles.cardTitle} iconSize={14} />

            <Text style={[globalStyles.label, { marginTop: 8 }]}>{t(e.preguntaKey)}</Text>
            <SpeakableText text={t(e.textKey)} style={globalStyles.textNormal} iconSize={13} />

            <Text style={[globalStyles.label, { marginTop: 8 }]}>Beneficios</Text>
            <ButtonCenterBulletList items={e.beneficios.map((b) => t(b as any))} />

            {e.ejemplos.length > 0 && (
              <>
                <Text style={[globalStyles.label, { marginTop: 8 }]}>Ejemplos</Text>
                <ButtonCenterBulletList items={e.ejemplos.map((x) => t(x as any))} />
              </>
            )}

            {e.videoKey && (
              <TouchableOpacity onPress={() => Linking.openURL(t(e.videoKey as any))} style={{ marginTop: 8 }}>
                <Text style={{ color: colors.text, textDecorationLine: "underline" }}>
                  {t(e.videoKey as any)}
                </Text>
              </TouchableOpacity>
            )}

            <Text style={[globalStyles.textNormal, { marginTop: 8, fontFamily: "LeagueSpartan_700Bold" }]}>
              Frecuencia recomendada: {t(e.frecuenciaKey)}
            </Text>
          </ButtonCenterCard>
        ))}
      </ScrollView>
    </View>
  );
}