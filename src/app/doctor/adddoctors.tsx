import { globalStyles } from "@/styles/global";
import { router } from "expo-router";
import { useState } from "react";

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import * as Haptics from "expo-haptics";

import { addDoctor } from "../../storage/doctorStorage";


export default function AddDoctors() {

  const [name, setName] = useState("");
  const [professionalism, setProfessionalism] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [details, setDetails] = useState("");


  const handleAddDoctors = async () => {

    // Check that required information exists
    if (!name || !phonenumber) {

      Alert.alert(
        "Error",
        "Por favor ingresa el nombre del doctor y el número de teléfono"
      );

      return;
    }


    // Save the doctor
    await addDoctor({

      name: name,

      professionalism: professionalism,

      phonenumber: phonenumber,

      details: details,

    });


    // Haptic feedback
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    );


    // Show success message
    Alert.alert(
      "Éxito",
      "Doctor guardado correctamente"
    );


    // Go back to the doctors list
    router.back();

  };


  return (

    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={styles.content}
    >

      <Text style={globalStyles.title}>
        Agregar Mi Doctor
      </Text>


      {/* NAME */}

      <Text style={styles.label}>
        Nombre
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del Doctor(a)"
        placeholderTextColor="#B0195B"
        value={name}
        onChangeText={setName}
      />


      {/* PROFESSION */}

      <Text style={styles.label}>
        Área de Profesión
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Psicología"
        placeholderTextColor="#B0195B"
        value={professionalism}
        onChangeText={setProfessionalism}
      />


      {/* PHONE NUMBER */}

      <Text style={styles.label}>
        Número de Teléfono
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Número de teléfono"
        placeholderTextColor="#B0195B"
        value={phonenumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />


      {/* DESCRIPTION */}

      <Text style={styles.label}>
        Descripción
      </Text>

      <TextInput
        style={styles.descriptionInput}
        placeholder="Quiero Anotar..."
        placeholderTextColor="#555"
        value={details}
        onChangeText={setDetails}
        multiline
        textAlignVertical="top"
      />


      {/* BUTTONS */}

      <View style={styles.buttonsRow}>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>
            Cancelar
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleAddDoctors}
        >
          <Text style={styles.buttonText}>
            Guardar
          </Text>
        </TouchableOpacity>

      </View>

    </ScrollView>

  );
}


const styles = StyleSheet.create({

  content: {
    padding: 20,
  },


  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 8,
  },


  input: {
    backgroundColor: "#FDE8EF",
    color: "#B0195B",
    padding: 16,
    borderRadius: 15,
    fontSize: 17,
  },


  descriptionInput: {
    borderWidth: 1,
    borderColor: "#F18BAA",
    borderRadius: 20,
    padding: 16,
    minHeight: 180,
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


  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

});