// app/ayuda/doctor.tsx

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

        <TouchableOpacity
          style={globalStyles.addButton}
          onPress={() => router.push("/ayuda/adddoctors")}
        >
          <Text style={globalStyles.addButtonText}>+ Agregar Mis Doctores</Text>
        </TouchableOpacity>

        {filteredDoctors.length === 0 ? (
          <Text style={globalStyles.empty}>No hay doctores guardados.</Text>
        ) : (
          filteredDoctors.map((doctor) => (
            <View key={doctor.id} style={globalStyles.card}>
              <Text style={globalStyles.cardTitle}>{doctor.name}</Text>
              <Text style={globalStyles.cardSubtitle}>{doctor.professionalism}</Text>
              <Text style={globalStyles.cardHighlight}>{doctor.phonenumber}</Text>

              <TouchableOpacity
                style={globalStyles.pillButton}
                onPress={() =>
                  router.push({
                    pathname: "/ayuda/adddoctors",
                    params: { id: doctor.id },
                  } as any)
                }
              >
                <Text style={globalStyles.pillButtonText}>Ver En Grande</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}