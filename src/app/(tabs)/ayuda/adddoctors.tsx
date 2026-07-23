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

import PinkHeader from "@/components/PinkHeader";
import { colors, globalStyles } from "@/styles/global";
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

  const handleDeleteOrCancel = async () => {
    if (editing) {
      Alert.alert("Eliminar Doctor", "¿Deseas eliminar este doctor?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await deleteDoctor(id as string);
            router.back();
          },
        },
      ]);
    } else {
      router.back();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <PinkHeader
        title={editing ? "Editar Mi Doctor" : "Agregar Mi Doctor O Centro De Salud"}
      />

      <ScrollView style={globalStyles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={globalStyles.label}>Nombre</Text>
        <TextInput
          style={globalStyles.formInput}
          placeholder="Nombre del Doctor(a)/Centro de salud"
          placeholderTextColor={globalStyles.placeholderColor.color}
          value={name}
          onChangeText={setName}
        />

        <Text style={globalStyles.label}>Área de Profesión</Text>
        <TextInput
          style={globalStyles.formInput}
          placeholder="eg. Psicología"
          placeholderTextColor={globalStyles.placeholderColor.color}
          value={professionalism}
          onChangeText={setProfessionalism}
        />

        <Text style={globalStyles.label}>Número de Teléfono</Text>
        <View style={styles.phoneRow}>
          <View style={[globalStyles.formInput, styles.phonePrefixBox]}>
            <Text style={styles.phonePrefixText}>+505</Text>
          </View>
          <TextInput
            style={[globalStyles.formInput, styles.phoneInput]}
            placeholder="8701-2259"
          placeholderTextColor={globalStyles.placeholderColor.color}
            value={phonenumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        <Text style={globalStyles.label}>Descripción</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Quiero Anotar..."
          placeholderTextColor={globalStyles.placeholderColor.color}
          value={details}
          onChangeText={setDetails}
          multiline
          textAlignVertical="top"
        />

        <View style={globalStyles.buttonsRow}>
          <TouchableOpacity style={globalStyles.actionButton} onPress={handleDeleteOrCancel}>
            <Text style={globalStyles.actionButtonText}>
              {editing ? "Eliminar" : "Cancelar"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={globalStyles.actionButton} onPress={handleAddDoctors}>
            <Text style={globalStyles.actionButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  phoneRow: { flexDirection: "row", gap: 10 },
  phonePrefixBox: { justifyContent: "center", paddingHorizontal: 16 },
  phonePrefixText: {
    fontFamily: "LeagueSpartan_700Bold",
    color: colors.text,
    fontSize: 16,
  },
  phoneInput: { flex: 1 },

  descriptionInput: {
    borderWidth: 1,
    borderColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    minHeight: 160,
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 16,
    color: colors.textSecondary,
    backgroundColor: colors.background,
  },
});