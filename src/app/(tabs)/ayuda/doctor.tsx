// app/ayuda/doctor.tsx

import { useLanguage } from "@/contexts/LanguageContext";
import { speakIfEnabled } from "@/hooks/useSpeak";
import { colors, globalStyles } from "@/styles/global";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

import PinkHeader from "@/components/PinkHeader";
import { Ionicons } from "@expo/vector-icons";
import {
  DoctorProfile,
  getDoctors,
} from "../../../storage/doctorStorage";

export default function DoctorsScreen() {
  const { t, language } = useLanguage();
  const showSpeakerIcons = language === "es";

  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [searchText, setSearchText] = useState("");

  const loadDoctors = async () => {
    const data = await getDoctors();
    setDoctors(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadDoctors();
    }, [])
  );

  const filteredDoctors = doctors.filter((doctor) => {
    const search = searchText.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(search) ||
      doctor.professionalism.toLowerCase().includes(search) ||
      doctor.phonenumber.toLowerCase().includes(search)
    );
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <PinkHeader title="Mis Listas De Doctores O Centro De Salud" />

      <ScrollView style={globalStyles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={globalStyles.searchBar}>
          <TextInput
            style={globalStyles.searchInput}
            placeholder="Buscar"
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
          <Ionicons name="search" size={20} color="#999" />
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TouchableOpacity
            style={[globalStyles.addButton, { flex: 1 }]}
            onPress={() => router.push("/ayuda/adddoctors")}
          >
            <Text style={globalStyles.addButtonText}>+ {t("agregarDoctores")}</Text>
          </TouchableOpacity>

          {showSpeakerIcons && (
            <TouchableOpacity
              onPress={() => speakIfEnabled(t("agregarDoctores"), language)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="volume-medium" size={18} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>

        {filteredDoctors.length === 0 ? (
          <Text style={globalStyles.empty}>No hay doctores guardados.</Text>
        ) : (
          filteredDoctors.map((doctor) => (
            <View key={doctor.id} style={globalStyles.card}>
              <Text style={globalStyles.cardTitle}>{doctor.name}</Text>
              <Text style={globalStyles.cardSubtitle}>{doctor.professionalism}</Text>
              <Text style={globalStyles.cardHighlight}>{doctor.phonenumber}</Text>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <TouchableOpacity
                  style={[globalStyles.pillButton, { flex: 1 }]}
                  onPress={() =>
                    router.push({
                      pathname: "/ayuda/adddoctors",
                      params: { id: doctor.id },
                    } as any)
                  }
                >
                  <Text style={globalStyles.pillButtonText}>{t("verGrande")}</Text>
                </TouchableOpacity>

                {showSpeakerIcons && (
                  <TouchableOpacity
                    onPress={() => speakIfEnabled(t("verGrande"), language)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="volume-medium" size={16} color={colors.text} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}