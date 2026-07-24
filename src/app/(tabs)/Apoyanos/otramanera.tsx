// app/(tabs)/Apoyanos/otramanera.tsx

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

import PinkHeader from "@/components/PinkHeader";
import { colors, globalStyles } from "@/styles/global";

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
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        <PinkHeader title="Quiero Apoyar De Otra Forma" />

        <View style={globalStyles.content}>
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

          <Text style={globalStyles.label}>Nombre de contacto</Text>
          <TextInput
            style={globalStyles.formInput}
            placeholder="Nombre y apellido"
            value={contactName}
            onChangeText={setContactName}
          />

          <Text style={globalStyles.label}>Empresa (si aplica)</Text>
          <TextInput
            style={globalStyles.formInput}
            placeholder="Nombre de la empresa"
            value={company}
            onChangeText={setCompany}
          />

          <Text style={globalStyles.label}>Correo electrónico</Text>
          <TextInput
            style={globalStyles.formInput}
            placeholder="nombre@empresa.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={globalStyles.label}>Teléfono</Text>
          <TextInput
            style={globalStyles.formInput}
            placeholder="+505 0000 0000"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={globalStyles.label}>Sitio web de la empresa (si aplica)</Text>
          <TextInput
            style={globalStyles.formInput}
            placeholder="www.empresa.com"
            value={website}
            onChangeText={setWebsite}
            autoCapitalize="none"
          />

          <Text style={globalStyles.label}>Cuéntanos sobre tu interés en apoyarnos</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Por ejemplo: compartir conocimiento, apoyar con marketing..."
            value={message}
            onChangeText={setMessage}
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity style={globalStyles.actionButton} onPress={handleSubmit}>
            <Text style={globalStyles.actionButtonText}>Enviar Solicitud De Contacto</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.text,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  stepNumber: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 16,
    color: colors.text,
  },
  stepLabel: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
  },
  intro: {
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 18,
    color: "#333",
    lineHeight: 20,
    marginBottom: 24,
  },
  textArea: {
    borderWidth: 1.5,
    borderColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 16,
    color: colors.textSecondary,
    minHeight: 100,
    marginBottom: 30,
  },
});