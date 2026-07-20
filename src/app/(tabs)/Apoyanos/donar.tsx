
// app/(tabs)/Apoyanos/donar.tsx

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const AMOUNTS = ["20", "40", "60", "100", "120", "150"];

export default function DonarScreen() {
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  const handleSelectAmount = (amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount(""); // clear custom when picking a preset
  };

  const handleDonarAhora = () => {
    const amount = customAmount || selectedAmount;

    if (!amount) {
      Alert.alert("Error", "Por favor selecciona o ingresa un monto");
      return;
    }

    router.push({
      pathname: "/(tabs)/Apoyanos/pago-tarjeta",
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

        <Text style={styles.headerTitle}>Quiero Donar</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.paragraph}>
          Tu donación nos ayudará a mejorar la app y a seguir creando
          recursos y herramientas accesibles para ti y para más mujeres.
        </Text>

        <View style={styles.amountGrid}>
          {AMOUNTS.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={[
                styles.amountChip,
                selectedAmount === amount && styles.amountChipSelected,
              ]}
              onPress={() => handleSelectAmount(amount)}
            >
              <Text
                style={[
                  styles.amountChipText,
                  selectedAmount === amount && styles.amountChipTextSelected,
                ]}
              >
                C${amount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.customAmountRow}>
          <Text style={styles.currencyPrefix}>C$</Text>
          <TextInput
            style={styles.customAmountInput}
            placeholder="Escribe el monto"
            placeholderTextColor="#C9A9BB"
            keyboardType="numeric"
            value={customAmount}
            onChangeText={(text) => {
              setCustomAmount(text);
              setSelectedAmount(null);
            }}
          />
        </View>

        <Text style={styles.sectionLabel}>Forma De Pago</Text>

        <View style={styles.paymentOption}>
          <Ionicons name="card-outline" size={22} color="#B0195B" />
          <Text style={styles.paymentOptionText}>Pagar En Tarjeta</Text>
          <View style={styles.radioOuter}>
            <View style={styles.radioInner} />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleDonarAhora}>
          <Text style={styles.buttonText}>Donar Ahora</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  },

  backButton: { position: "absolute", top: 60, left: 20 },

  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#B0195B" },

  content: { paddingHorizontal: 24, paddingTop: 24 },

  paragraph: { fontSize: 14, color: "#555", lineHeight: 20, marginBottom: 24 },

  amountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },

  amountChip: {
    borderWidth: 1,
    borderColor: "#F0DCE4",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },

  amountChipSelected: {
    backgroundColor: "#B0195B",
    borderColor: "#B0195B",
  },

  amountChipText: { color: "#222", fontSize: 14 },

  amountChipTextSelected: { color: "white", fontWeight: "bold" },

  customAmountRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0DCE4",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 30,
  },

  currencyPrefix: { fontSize: 15, color: "#B0195B", marginRight: 8 },

  customAmountInput: { flex: 1, paddingVertical: 14, fontSize: 15 },

  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    marginBottom: 10,
  },

  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#F0DCE4",
    borderRadius: 12,
    padding: 14,
    marginBottom: 30,
  },

  paymentOptionText: { flex: 1, fontSize: 15, color: "#222" },

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#B0195B",
    alignItems: "center",
    justifyContent: "center",
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#B0195B",
  },

  button: {
    backgroundColor: "#B0195B",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
  },

  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});