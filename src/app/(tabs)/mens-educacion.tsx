import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import ButtonCenterBulletList from "@/components/buttonCenterBulletList";
import ButtonCenterCard from "@/components/buttonCenterCard";
import ButtonInfoHeader from "@/components/buttonInfoHeader";
import SpeakableText from "@/components/SpeakableText";
import { colors, globalStyles } from "@/styles/global";

export default function MensEducacionScreen() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const sectionMatches = (...texts: string[]) =>
    !query || texts.join(" ").toLowerCase().includes(query);

  const showPubertad = sectionMatches(t("pubertadTitulo"), t("pubertadTexto"), t("pubertad1"), t("pubertad2"), t("pubertad3"), t("pubertad4"), t("pubertad5"));
  const showConsentimiento = sectionMatches(t("consentimientoTitulo"), t("consentimientoTexto"), t("consentimiento1"), t("consentimiento2"), t("consentimiento3"), t("consentimiento4"));
  const showHigiene = sectionMatches(t("higieneTitulo"), t("higiene1"), t("higiene2"), t("higiene3"), t("higiene4"));
  const showRegistro = sectionMatches(t("registroTitulo"), t("registro1"), t("registro2"), t("registro3"), t("registro4"), t("registroTexto"));
  const showHablar = sectionMatches(t("hablarTitulo"), t("hablarTexto"));

  const noResults = query && !showPubertad && !showConsentimiento && !showHigiene && !showRegistro && !showHablar;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ButtonInfoHeader title={t("educacionSexualTitulo")} searchValue={search} onSearchChange={setSearch} />

      <ScrollView style={globalStyles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        {noResults && <Text style={[globalStyles.textNormal, { marginTop: 20 }]}>Sin resultados</Text>}

        {showPubertad && (
          <>
            <ButtonCenterCard>
              <SpeakableText text={`1. ${t("pubertadTitulo")}`} style={globalStyles.cardTitle} iconSize={14} />
              <SpeakableText text={t("pubertadTexto")} style={[globalStyles.textNormal, { marginTop: 6 }]} iconSize={13} />
              <ButtonCenterBulletList
                items={[t("pubertad1"), t("pubertad2"), t("pubertad3"), t("pubertad4"), t("pubertad5")]}
              />
            </ButtonCenterCard>
          </>
        )}

        {showConsentimiento && (
          <ButtonCenterCard>
            <SpeakableText text={`2. ${t("consentimientoTitulo")}`} style={globalStyles.cardTitle} iconSize={14} />
            <SpeakableText text={t("consentimientoTexto")} style={[globalStyles.textNormal, { marginTop: 6 }]} iconSize={13} />
            <ButtonCenterBulletList
              items={[t("consentimiento1"), t("consentimiento2"), t("consentimiento3"), t("consentimiento4")]}
            />
            <SpeakableText
              text={t("educacionIntegralTexto")}
              style={[globalStyles.textNormal, { marginTop: 10 }]}
              iconSize={13}
            />
          </ButtonCenterCard>
        )}

        {showHigiene && (
          <ButtonCenterCard>
            <SpeakableText text={`3. ${t("higieneTitulo")}`} style={globalStyles.cardTitle} iconSize={14} />
            <ButtonCenterBulletList items={[t("higiene1"), t("higiene2"), t("higiene3"), t("higiene4")]} />
          </ButtonCenterCard>
        )}

        {showRegistro && (
          <ButtonCenterCard>
            <SpeakableText text={`4. ${t("registroTitulo")}`} style={globalStyles.cardTitle} iconSize={14} />
            <ButtonCenterBulletList items={[t("registro1"), t("registro2"), t("registro3"), t("registro4")]} />
            <SpeakableText text={t("registroTexto")} style={[globalStyles.textNormal, { marginTop: 10 }]} iconSize={13} />
          </ButtonCenterCard>
        )}

        {showHablar && (
          <ButtonCenterCard>
            <SpeakableText text={t("hablarTitulo")} style={globalStyles.label} iconSize={14} />
            <SpeakableText text={t("hablarTexto")} style={globalStyles.textNormal} iconSize={13} />
          </ButtonCenterCard>
        )}
      </ScrollView>
    </View>
  );
}