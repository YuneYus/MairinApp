// app/ayuda/adddoctors.tsx

import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import {
  addDoctor,
  deleteDoctor,
  getDoctorById,
  updateDoctor,
} from "../../../storage/doctorStorage";

export default function AddDoctors() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const editing = !!id;

  const [name, setName] = useState("");
  const [professionalism, setProfessionalism] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    if (!editing) return;

    const loadDoctor = async () => {
      const doctor = await getDoctorById(id as string);
      if (!doctor) return;

      setName(doctor.name);
      setProfessionalism(doctor.professionalism);
      setPhoneNumber(doctor.phonenumber);
      setDetails(doctor.details);
    };

    loadDoctor();
  }, [id]);

  const handleAddDoctors = async () => {
    if (!name || !phonenumber) {
      Alert.alert(
        "Error",
        "Por favor ingresa el nombre del doctor y el número de teléfono"
      );
      return;
    }

    if (editing) {
      const doctor = await getDoctorById(id as string);
      if (!doctor) {
        Alert.alert("Error", "No se encontró el doctor.");
        return;
      }

      await updateDoctor({ ...doctor, name, professionalism, phonenumber, details });
    } else {
      await addDoctor({ name, professionalism, phonenumber, details });
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Éxito", "Doctor guardado correctamente");
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#B0195B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {editing ? "Editar Mi Doctor" : "Agregar Mi Doctor O Centro De Salud"}
        </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre del Doctor(a)/Centro de salud"
          placeholderTextColor="#C9A9BB"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Area de Professión</Text>
        <TextInput
          style={styles.input}
          placeholder="eg. Psicología"
          placeholderTextColor="#C9A9BB"
          value={professionalism}
          onChangeText={setProfessionalism}
        />

        <Text style={styles.label}>Número de Teléfono</Text>
        <View style={styles.phoneRow}>
          <View style={styles.phonePrefixBox}>
            <Text style={styles.phonePrefixText}>+505</Text>
          </View>
          <TextInput
            style={[styles.input, styles.phoneInput]}
            placeholder="8701-2259"
            placeholderTextColor="#C9A9BB"
            value={phonenumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Quiero Anotar..."
          placeholderTextColor="#C9A9BB"
          value={details}
          onChangeText={setDetails}
          multiline
          textAlignVertical="top"
        />

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={async () => {
              if (editing) {
                Alert.alert(
                  "Eliminar Doctor",
                  "¿Deseas eliminar este doctor?",
                  [
                    { text: "Cancelar", style: "cancel" },
                    {
                      text: "Eliminar",
                      style: "destructive",
                      onPress: async () => {
                        await deleteDoctor(id as string);
                        router.back();
                      },
                    },
                  ]
                );
              } else {
                router.back();
              }
            }}
          >
            <Text style={styles.buttonText}>
              {editing ? "Eliminar" : "Cancelar"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleAddDoctors}>
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
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

  label: { fontSize: 16, fontWeight: "bold", marginTop: 22, marginBottom: 8, color: "#222" },

  input: {
    backgroundColor: "#FDE8EF",
    color: "#B0195B",
    padding: 16,
    borderRadius: 15,
    fontSize: 16,
  },

  phoneRow: { flexDirection: "row", gap: 10 },
  phonePrefixBox: {
    backgroundColor: "#FDE8EF",
    borderRadius: 15,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  phonePrefixText: { color: "#B0195B", fontSize: 16, fontWeight: "600" },
  phoneInput: { flex: 1 },

  descriptionInput: {
    borderWidth: 1,
    borderColor: "#F18BAA",
    borderRadius: 20,
    padding: 16,
    minHeight: 160,
    fontSize: 16,
    backgroundColor: "white",
  },

  buttonsRow: {
    flexDirection: "row",
    gap: 15,
    marginTop: 30,
    marginBottom: 30,
  },

  actionButton: {
    flex: 1,
    backgroundColor: "#B0195B",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
  },

  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});