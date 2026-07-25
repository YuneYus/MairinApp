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

import { colors, globalStyles } from "@/styles/global";

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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={globalStyles.content}>
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

        <Text style={globalStyles.label}>Nombre Del Titular</Text>
        <TextInput
          style={globalStyles.formInput}
          value={cardName}
          onChangeText={setCardName}
          placeholder="Nombre completo"
        />

        <Text style={globalStyles.label}>Número De Tarjeta</Text>
        <TextInput
          style={globalStyles.formInput}
          value={cardNumber}
          onChangeText={setCardNumber}
          placeholder="000 000 000 00"
          keyboardType="numeric"
        />

        <View style={styles.row}>
          <View style={styles.flex}>
            <Text style={[globalStyles.label, styles.rowLabel]}>Fecha De Caducidad</Text>
            <TextInput
              style={globalStyles.formInput}
              value={expiry}
              onChangeText={setExpiry}
              placeholder="04/28"
            />
          </View>

          <View style={styles.flex}>
            <Text style={[globalStyles.label, styles.rowLabel]}>CVV</Text>
            <TextInput
              style={globalStyles.formInput}
              value={cvv}
              onChangeText={setCvv}
              placeholder="000"
              keyboardType="numeric"
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity style={styles.payButton} onPress={handlePagar}>
          <Text style={globalStyles.actionButtonText}>Pagar Con Tarjeta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 60, paddingHorizontal: 24 },

  backButton: {},

  cardPreview: {
    backgroundColor: colors.text,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    height: 140,
    justifyContent: "space-between",
  },

  cardNumberPreview: {
    fontFamily: "LeagueSpartan_400Regular",
    color: "white",
    fontSize: 16,
    letterSpacing: 2,
  },

  cardPreviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardPreviewLabel: {
    fontFamily: "LeagueSpartan_400Regular",
    color: colors.surface,
    fontSize: 16,
  },

  cardPreviewValue: {
    fontFamily: "LeagueSpartan_700Bold",
    color: "white",
    fontSize: 16,
  },

  row: { flexDirection: "row", gap: 14 },

  flex: { flex: 1 },

  rowLabel: {
    minHeight: 56,
  },

  payButton: {
    backgroundColor: colors.text,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 30,
  },
});