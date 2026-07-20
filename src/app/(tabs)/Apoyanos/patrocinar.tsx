

// app/(tabs)/Apoyanos/patrocinar.tsx

import { Ionicons } from "@expo/vector-icons";
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

export default function PatrocinarScreen() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!name || !email) {
      Alert.alert("Error", "Por favor completa al menos nombre y correo");
      return;
    }

    Alert.alert("Éxito", "Tu solicitud ha sido enviada");
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#B0195B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Quiero Ser Patrocinador</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.stepsRow}>
          <View style={styles.step}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <Text style={styles.stepText}>Envías tu solicitud</Text>
          </View>

          <View style={styles.step}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <Text style={styles.stepText}>
              Coordinamos una llamada y cerramos el acuerdo
            </Text>
          </View>

          <View style={styles.step}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <Text style={styles.stepText}>Tu logo se publica en la app</Text>
          </View>
        </View>

        <Text style={styles.note}>
          Como agradecimiento, tu logo aparecerá en la parte superior de la
          página principal de nuestra app. Completa tus datos y te
          contactamos para coordinar los detalles.
        </Text>

        <Text style={styles.label}>Nombre de contacto</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nombre y apellido"
          placeholderTextColor="#C9A9BB"
        />

        <Text style={styles.label}>Empresa</Text>
        <TextInput
          style={styles.input}
          value={company}
          onChangeText={setCompany}
          placeholder="Nombre de la empresa"
          placeholderTextColor="#C9A9BB"
        />

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="nombre@empresa.com"
          placeholderTextColor="#C9A9BB"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="+505 0000 0000"
          placeholderTextColor="#C9A9BB"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Sitio web de la empresa</Text>
        <TextInput
          style={styles.input}
          value={website}
          onChangeText={setWebsite}
          placeholder="www.empresa.com"
          placeholderTextColor="#C9A9BB"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Cuéntanos sobre tu interés en patrocinar</Text>
        <TextInput
          style={styles.textarea}
          value={message}
          onChangeText={setMessage}
          placeholder="Por ejemplo: presupuesto disponible, tiempo de exposición deseado, preguntas..."
          placeholderTextColor="#C9A9BB"
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Enviar Solicitud De Contacto</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },

  header: {
    backgroundColor: "#F6C6D6",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 30,
  },

  backButton: { position: "absolute", top: 60, left: 20 },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#B0195B",
    textAlign: "center",
  },

  content: { padding: 24 },

  stepsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },

  step: { flex: 1, alignItems: "center" },

  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FBDCE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  stepNumber: { fontWeight: "bold", color: "#B0195B" },

  stepText: { fontSize: 11, textAlign: "center", color: "#444" },

  note: { fontSize: 12, color: "#666", lineHeight: 18, marginBottom: 20 },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#222",
    marginBottom: 6,
    marginTop: 14,
  },

  input: {
    backgroundColor: "#FDE8EF",
    color: "#222",
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
  },

  textarea: {
    backgroundColor: "#FDE8EF",
    color: "#222",
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
    minHeight: 90,
  },

  button: {
    backgroundColor: "#B0195B",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 30,
  },

  buttonText: { color: "white", fontSize: 15, fontWeight: "bold" },
});