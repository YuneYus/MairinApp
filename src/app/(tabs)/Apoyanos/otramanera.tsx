// app/(tabs)/Apoyanos/otramanera.tsx

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function OtraManeraScreen() {
  const [contactName, setContactName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    // TODO: send this data to your backend / email service
    console.log({ contactName, company, email, phone, website, message });

    Alert.alert(
      "Solicitud enviada",
      "Una vez que la recibamos, te responderemos lo antes posible.",
      [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "white" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#B0195B" />
        </TouchableOpacity>

        <Text style={styles.title}>Quiero Apoyar De Otra Forma</Text>

        <View style={styles.stepsRow}>
          <View style={styles.stepCard}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <Text style={styles.stepLabel}>Envías tu solicitud</Text>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <Text style={styles.stepLabel}>
              Coordinamos una llamada y cerramos el acuerdo
            </Text>
          </View>
        </View>

        <Text style={styles.intro}>
          ¿Te gustaría ayudarnos de otra manera? Nos encantaría contar con tu
          apoyo. Puedes apoyarnos compartiendo tus conocimientos, tiempo,
          recursos o ayudándonos a llegar a más mujeres.
        </Text>

        <Text style={styles.label}>Nombre de contacto</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre y apellido"
          placeholderTextColor="#C97A93"
          value={contactName}
          onChangeText={setContactName}
        />

        <Text style={styles.label}>Empresa (si aplica)</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de la empresa"
          placeholderTextColor="#C97A93"
          value={company}
          onChangeText={setCompany}
        />

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="nombre@empresa.com"
          placeholderTextColor="#C97A93"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          placeholder="+505 0000 0000"
          placeholderTextColor="#C97A93"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Sitio web de la empresa (si aplica)</Text>
        <TextInput
          style={styles.input}
          placeholder="www.empresa.com"
          placeholderTextColor="#C97A93"
          value={website}
          onChangeText={setWebsite}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Cuéntanos sobre tu interés en apoyarnos</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Por ejemplo: compartir conocimiento, apoyar con marketing..."
          placeholderTextColor="#999"
          value={message}
          onChangeText={setMessage}
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Enviar Solicitud De Contacto</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FBDCE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#B0195B",
    textAlign: "center",
    marginBottom: 24,
  },
  stepsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  stepCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#EED9DF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FBDCE7",
    borderWidth: 1.5,
    borderColor: "#B0195B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#B0195B",
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
  },
  intro: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    color: "#222",
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    backgroundColor: "#FDE8EF",
    color: "#B0195B",
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    marginBottom: 20,
  },
  textArea: {
    borderWidth: 1.5,
    borderColor: "#F6AFC5",
    borderRadius: 16,
    padding: 14,
    fontSize: 14,
    color: "#222",
    minHeight: 100,
    marginBottom: 30,
  },
  submitButton: {
    backgroundColor: "#B0195B",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
});