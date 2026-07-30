import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import ButtonCenterBulletList from "@/components/buttonCenterBulletList";
import ButtonCenterCard from "@/components/buttonCenterCard";
import ButtonInfoHeader from "@/components/buttonInfoHeader";
import SpeakableText from "@/components/SpeakableText";
import { colors, globalStyles } from "@/styles/global";

const NUTRIENTES = [
  { n: 1, titleKey: "hierroTitulo", textKey: "hierroTexto", items: ["hierro1","hierro2","hierro3","hierro4","hierro5","hierro6","hierro7","hierro8","hierro9","hierro10"] },
  { n: 2, titleKey: "vitaminaCTitulo", textKey: "vitaminaCTexto", items: ["vitaminaC1","vitaminaC2","vitaminaC3","vitaminaC4","vitaminaC5","vitaminaC6","vitaminaC7","vitaminaC8","vitaminaC9","vitaminaC10"] },
  { n: 3, titleKey: "calcioTitulo", textKey: "calcioTexto", items: ["calcio1","calcio2","calcio3","calcio4","calcio5","calcio6"] },
  { n: 4, titleKey: "magnesioTitulo", textKey: "magnesioTexto", items: ["magnesio1","magnesio2","magnesio3","magnesio4","magnesio5","magnesio6","magnesio7"] },
  { n: 5, titleKey: "omegaTitulo", textKey: "omegaTexto", items: ["omega1","omega2","omega3","omega4","omega5","omega6"] },
] as const;

const CONSEJO_KEYS = ["consejo1","consejo2","consejo3","consejo4","consejo5","consejo6","consejo7"] as const;

export default function MensAlimentoScreen() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const matches = (...texts: string[]) =>
    !query || texts.join(" ").toLowerCase().includes(query);

  const filteredNutrientes = NUTRIENTES.filter((n) =>
    matches(t(n.titleKey), t(n.textKey), ...n.items.map((i) => t(i as any)))
  );

  const showIntro = matches(t("alimentacionMenstruacionTitulo"), t("alimentacionMenstruacionTexto"));
  const showAgua = matches(t("aguaTitulo"), t("aguaTexto"));
  const showSodio = matches(t("sodioTitulo"), t("sodioTexto"), t("sodioEjemplos"));
  const showAzucar = matches(t("azucarTitulo"), t("azucarTexto"));
  const showCafeina = matches(t("cafeinaTitulo"), t("cafeinaTexto"));
  const showAlcohol = matches(t("alcoholTitulo"), t("alcoholTexto"));
  const filteredConsejos = CONSEJO_KEYS.filter((k) => matches(t(k)));

  const noResults =
    query &&
    filteredNutrientes.length === 0 &&
    !showIntro &&
    !showAgua &&
    !showSodio &&
    !showAzucar &&
    !showCafeina &&
    !showAlcohol &&
    filteredConsejos.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ButtonInfoHeader title={t("alimentacionTitulo")} searchValue={search} onSearchChange={setSearch} />

      <ScrollView style={globalStyles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        {noResults && <Text style={[globalStyles.textNormal, { marginTop: 20 }]}>Sin resultados</Text>}

        {showIntro && (
          <ButtonCenterCard>
            <SpeakableText text={t("alimentacionMenstruacionTitulo")} style={globalStyles.cardTitle} iconSize={14} />
            <SpeakableText
              text={t("alimentacionMenstruacionTexto")}
              style={[globalStyles.textNormal, { marginTop: 8 }]}
              iconSize={13}
            />
          </ButtonCenterCard>
        )}

        {filteredNutrientes.length > 0 && (
          <SpeakableText
            text={t("alimentosRecomendadosTitulo")}
            style={[globalStyles.label, { marginTop: 20 }]}
            iconSize={14}
          />
        )}

        {filteredNutrientes.map((n) => (
          <ButtonCenterCard key={n.n}>
            <SpeakableText text={`${n.n}. ${t(n.titleKey)}`} style={globalStyles.cardTitle} iconSize={13} />
            <SpeakableText
              text={t(n.textKey)}
              style={[globalStyles.textNormal, { marginTop: 6 }]}
              iconSize={12}
            />
            <Text style={[globalStyles.label, { marginTop: 8 }]}>
              {t(`${n.titleKey.replace("Titulo", "EjemploTitulo")}` as any)}
            </Text>
            <SpeakableText
              text={n.items.map((i) => t(i as any)).join(", ")}
              style={globalStyles.textNormal}
              iconSize={12}
            />
          </ButtonCenterCard>
        ))}

        {showAgua && (
          <ButtonCenterCard>
            <SpeakableText text={t("aguaTitulo")} style={globalStyles.label} iconSize={14} />
            <SpeakableText text={t("aguaTexto")} style={globalStyles.textNormal} iconSize={13} />
          </ButtonCenterCard>
        )}

        {(showSodio || showAzucar || showCafeina || showAlcohol) && (
          <SpeakableText text={t("menosTitulo")} style={[globalStyles.label, { marginTop: 20 }]} iconSize={14} />
        )}

        {showSodio && (
          <ButtonCenterCard>
            <SpeakableText text={t("sodioTitulo")} style={globalStyles.cardTitle} iconSize={13} />
            <SpeakableText text={t("sodioTexto")} style={globalStyles.textNormal} iconSize={12} />
            <Text style={[globalStyles.label, { marginTop: 6 }]}>{t("hierroEjemploTitulo")}</Text>
            <SpeakableText text={t("sodioEjemplos")} style={globalStyles.textNormal} iconSize={12} />
          </ButtonCenterCard>
        )}

        {showAzucar && (
          <ButtonCenterCard>
            <SpeakableText text={t("azucarTitulo")} style={globalStyles.cardTitle} iconSize={13} />
            <SpeakableText text={t("azucarTexto")} style={globalStyles.textNormal} iconSize={12} />
          </ButtonCenterCard>
        )}

        {showCafeina && (
          <ButtonCenterCard>
            <SpeakableText text={t("cafeinaTitulo")} style={globalStyles.cardTitle} iconSize={13} />
            <SpeakableText text={t("cafeinaTexto")} style={globalStyles.textNormal} iconSize={12} />
          </ButtonCenterCard>
        )}

        {showAlcohol && (
          <ButtonCenterCard>
            <SpeakableText text={t("alcoholTitulo")} style={globalStyles.cardTitle} iconSize={13} />
            <SpeakableText text={t("alcoholTexto")} style={globalStyles.textNormal} iconSize={12} />
          </ButtonCenterCard>
        )}

        {filteredConsejos.length > 0 && (
          <>
            <SpeakableText text={t("consejosTitulo")} style={[globalStyles.label, { marginTop: 20 }]} iconSize={14} />
            <ButtonCenterBulletList items={filteredConsejos.map((k) => t(k))} />
          </>
        )}
      </ScrollView>
    </View>
  );
}