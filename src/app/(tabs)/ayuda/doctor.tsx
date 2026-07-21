// app/ayuda/doctor.tsx

import { globalStyles } from "@/styles/global";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#B0195B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Listas De Doctores O Centro De Salud</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar"
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
          <Ionicons name="search" size={20} color="#999" />
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/ayuda/adddoctors")}
        >
          <Text style={styles.addButtonText}>+ Agregar Mis Doctores</Text>
        </TouchableOpacity>

        {filteredDoctors.length === 0 ? (
          <Text style={globalStyles.empty}>No hay doctores guardados.</Text>
        ) : (
          filteredDoctors.map((doctor) => (
            <View key={doctor.id} style={styles.doctorCard}>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <Text style={styles.doctorSpecialty}>{doctor.professionalism}</Text>
              <Text style={styles.doctorPhone}>{doctor.phonenumber}</Text>

              <TouchableOpacity
                style={styles.verButton}
                onPress={() =>
                  router.push({
                    pathname: "/ayuda/adddoctors",
                    params: { id: doctor.id },
                  } as any)
                }
              >
                <Text style={styles.verButtonText}>Ver En Grande</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },

  header: {
    backgroundColor: "#F6C6D6",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  backButton: { marginBottom: 12 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#B0195B" },

  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFEDF3",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: { flex: 1, fontSize: 15, color: "#222" },

  addButton: {
    backgroundColor: "#B0195B",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: { color: "white", fontSize: 15, fontWeight: "bold" },

  doctorCard: {
    backgroundColor: "#FBDCE7",
    borderRadius: 18,
    padding: 18,
    marginTop: 20,
  },
  doctorName: { fontSize: 17, fontWeight: "bold", color: "#B0195B" },
  doctorSpecialty: { fontSize: 14, color: "#444", marginTop: 4 },
  doctorPhone: { fontSize: 20, fontWeight: "bold", color: "#B0195B", marginTop: 8 },

  verButton: {
    backgroundColor: "#B0195B",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  verButtonText: { color: "white", fontSize: 14, fontWeight: "bold" },
});