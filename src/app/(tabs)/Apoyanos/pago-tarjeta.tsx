
// app/(tabs)/Apoyanos/pago-tarjeta.tsx

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function PagoTarjetaScreen() {
  const { amount } = useLocalSearchParams<{ amount: string }>();

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePagar = () => {
    if (!cardName || !cardNumber || !expiry || !cvv) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    router.push({
      pathname: "/(tabs)/Apoyanos/resumen",
      params: { amount },
    } as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#B0195B" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.cardPreview}>
          <Text style={styles.cardNumberPreview}>
            {cardNumber || "000 000 000 00"}
          </Text>

          <View style={styles.cardPreviewRow}>
            <View>
              <Text style={styles.cardPreviewLabel}>Nombre Del Titular</Text>
              <Text style={styles.cardPreviewValue}>
                {cardName || "Lily Hernandez"}
              </Text>
            </View>

            <View>
              <Text style={styles.cardPreviewLabel}>Fecha De Caducidad</Text>
              <Text style={styles.cardPreviewValue}>
                {expiry || "04/28"}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.label}>Nombre Del Titular</Text>
        <TextInput
          style={styles.input}
          value={cardName}
          onChangeText={setCardName}
          placeholder="Nombre completo"
          placeholderTextColor="#C9A9BB"
        />

        <Text style={styles.label}>Número De Tarjeta</Text>
        <TextInput
          style={styles.input}
          value={cardNumber}
          onChangeText={setCardNumber}
          placeholder="000 000 000 00"
          placeholderTextColor="#C9A9BB"
          keyboardType="numeric"
        />

        <View style={styles.row}>
          <View style={styles.flex}>
            <Text style={styles.label}>Fecha De Caducidad</Text>
            <TextInput
              style={styles.input}
              value={expiry}
              onChangeText={setExpiry}
              placeholder="04/28"
              placeholderTextColor="#C9A9BB"
            />
          </View>

          <View style={styles.flex}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              value={cvv}
              onChangeText={setCvv}
              placeholder="000"
              placeholderTextColor="#C9A9BB"
              keyboardType="numeric"
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handlePagar}>
          <Text style={styles.buttonText}>Pagar Con Tarjeta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },

  header: { paddingTop: 60, paddingHorizontal: 24 },

  backButton: {},

  content: { paddingHorizontal: 24, paddingTop: 20 },

  cardPreview: {
    backgroundColor: "#B0195B",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    height: 140,
    justifyContent: "space-between",
  },

  cardNumberPreview: {
    color: "white",
    fontSize: 16,
    letterSpacing: 2,
  },

  cardPreviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardPreviewLabel: { color: "#F6C6D6", fontSize: 10 },

  cardPreviewValue: { color: "white", fontSize: 13, fontWeight: "bold" },

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

  row: { flexDirection: "row", gap: 14 },

  flex: { flex: 1 },

  button: {
    backgroundColor: "#B0195B",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 30,
  },

  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});