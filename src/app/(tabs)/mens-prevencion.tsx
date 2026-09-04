

import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import ButtonCenterBulletList from "@/components/buttonCenterBulletList";
import ButtonCenterCard from "@/components/buttonCenterCard";
import ButtonInfoHeader from "@/components/buttonInfoHeader";
import SpeakableText from "@/components/SpeakableText";
import { colors, globalStyles } from "@/styles/global";

const ENFERMEDADES = [
  { titleKey: "sopTitulo", textKey: "sopTexto" },
  { titleKey: "endometriosisTitulo", textKey: "endometriosisTexto" },
  { titleKey: "spmTitulo", textKey: "spmTexto" },
  { titleKey: "tdpmTitulo", textKey: "tdpmTexto" },
] as const;

export default function MensPrevencionScreen() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const filteredEnfermedades = query
    ? ENFERMEDADES.filter((e) => [t(e.titleKey), t(e.textKey)].join(" ").toLowerCase().includes(query))
    : ENFERMEDADES;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ButtonInfoHeader title={t("prevencionTitulo")} searchValue={search} onSearchChange={setSearch} />

      <ScrollView style={globalStyles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        {!query && (
          <>
            <ButtonCenterCard>
              <SpeakableText text={`1. ${t("infeccionesTitulo")}`} style={globalStyles.cardTitle} iconSize={14} />
              <Text style={[globalStyles.label, { marginTop: 10 }]}>Recomendaciones:</Text>
              <ButtonCenterBulletList
                items={[t("infeccion1"), t("infeccion2"), t("infeccion3"), t("infeccion4")]}
              />
              <SpeakableText
                text={t("infeccionesTexto")}
                style={[globalStyles.textNormal, { marginTop: 10 }]}
                iconSize={13}
              />
            </ButtonCenterCard>

            <ButtonCenterCard>
              <SpeakableText text={`2. ${t("vacunacionTitulo")}`} style={globalStyles.cardTitle} iconSize={14} />
              <SpeakableText
                text={t("vacunacionTexto")}
                style={[globalStyles.textNormal, { marginTop: 8 }]}
                iconSize={13}
              />
            </ButtonCenterCard>

            <ButtonCenterCard>
              <SpeakableText text={`3. ${t("itsTitulo")}`} style={globalStyles.cardTitle} iconSize={14} />
              <SpeakableText
                text={t("itsTexto")}
                style={[globalStyles.textNormal, { marginTop: 8 }]}
                iconSize={13}
              />
              <Text style={[globalStyles.label, { marginTop: 10 }]}>{t("comoPrevenirTitulo")}</Text>
              <ButtonCenterBulletList items={[t("its1"), t("its2"), t("its3"), t("its4")]} />
            </ButtonCenterCard>
          </>
        )}

        <SpeakableText
          text={`4. ${t("enfermedadesRelacionadasTitulo")}`}
          style={[globalStyles.label, { marginTop: 20 }]}
          iconSize={14}
        />

        {filteredEnfermedades.length === 0 && (
          <Text style={globalStyles.textNormal}>Sin resultados</Text>
        )}

        {filteredEnfermedades.map((e) => (
          <ButtonCenterCard key={e.titleKey}>
            <SpeakableText text={t(e.titleKey)} style={globalStyles.cardTitle} iconSize={13} />
            <SpeakableText text={t(e.textKey)} style={globalStyles.textNormal} iconSize={12} />
          </ButtonCenterCard>
        ))}
      </ScrollView>
    </View>
  );
}