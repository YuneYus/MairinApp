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

import { colors, globalStyles } from "@/styles/global";

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
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={globalStyles.pinkHeaderTitle}>Quiero Ser Patrocinador</Text>
      </View>

      <View style={globalStyles.content}>
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

        <Text style={globalStyles.label}>Nombre de contacto</Text>
        <TextInput
          style={globalStyles.formInput}
          value={name}
          onChangeText={setName}
          placeholder="Nombre y apellido"
        />

        <Text style={globalStyles.label}>Empresa</Text>
        <TextInput
          style={globalStyles.formInput}
          value={company}
          onChangeText={setCompany}
          placeholder="Nombre de la empresa"
        />

        <Text style={globalStyles.label}>Correo electrónico</Text>
        <TextInput
          style={globalStyles.formInput}
          value={email}
          onChangeText={setEmail}
          placeholder="nombre@empresa.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={globalStyles.label}>Teléfono</Text>
        <TextInput
          style={globalStyles.formInput}
          value={phone}
          onChangeText={setPhone}
          placeholder="+505 0000 0000"
          keyboardType="phone-pad"
        />

        <Text style={globalStyles.label}>Sitio web de la empresa</Text>
        <TextInput
          style={globalStyles.formInput}
          value={website}
          onChangeText={setWebsite}
          placeholder="www.empresa.com"
          autoCapitalize="none"
        />

        <Text style={globalStyles.label}>Cuéntanos sobre tu interés en patrocinar</Text>
        <TextInput
          style={styles.textarea}
          value={message}
          onChangeText={setMessage}
          placeholder="Por ejemplo: presupuesto disponible, tiempo de exposición deseado, preguntas..."
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity style={[globalStyles.actionButton,{marginTop:20}]} onPress={handleSubmit}>
          <Text style={globalStyles.actionButtonText}>Enviar Solicitud De Contacto</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 30,
  },

  backButton: { position: "absolute", top: 60, left: 20 },

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
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  stepNumber: {
    fontFamily: "LeagueSpartan_700Bold",
    color: colors.text,
    fontSize: 16
  },

  stepText: {
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 16,
    textAlign: "center",
    color: colors.textSecondary,
  },

  note: {
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 16,
    color: "#666",
    lineHeight: 18,
    marginBottom: 20,
  },

  textarea: {
    backgroundColor: colors.inputBackground,
    color: colors.text,
    fontFamily: "LeagueSpartan_400Regular",
    padding: 16,
    borderRadius: 15,
    fontSize: 16,
    minHeight: 90,
  },
});