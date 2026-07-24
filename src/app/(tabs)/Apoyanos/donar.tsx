// app/(tabs)/Apoyanos/donar.tsx

import { colors, globalStyles } from "@/styles/global";
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
      <View style={globalStyles.pinkHeader}>
        <TouchableOpacity
          style={globalStyles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={globalStyles.pinkHeaderTitle}>Quiero Donar</Text>
      </View>

      <View style={globalStyles.content}>
        <Text style={globalStyles.textNormal}>
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

        <View style={[globalStyles.input, styles.customAmountRow]}>
          <Text style={styles.currencyPrefix}>C$</Text>
          <TextInput
            style={styles.customAmountInput}
            placeholder="Escribe el monto"
            placeholderTextColor={colors.text}
            keyboardType="numeric"
            value={customAmount}
            onChangeText={(text) => {
              setCustomAmount(text);
              setSelectedAmount(null);
            }}
          />
        </View>

        <Text style={globalStyles.label}>Forma De Pago</Text>

        <View style={styles.paymentOption}>
          <Ionicons name="card-outline" size={22} color={colors.text} />
          <Text style={globalStyles.textNormal}>Pagar En Tarjeta</Text>
          <View style={styles.radioOuter}>
            <View style={styles.radioInner} />
          </View>
        </View>

        <TouchableOpacity style={globalStyles.pillButton} onPress={handleDonarAhora}>
          <Text style={globalStyles.pillButtonText}>Donar Ahora</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  amountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
  },

  amountChip: {
    borderWidth: 1,
    borderColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },

  amountChipSelected: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },

  amountChipText: {
    fontFamily: "LeagueSpartan_400Regular",
    color: colors.textSecondary,
    fontSize: 14,
  },

  amountChipTextSelected: {
    fontFamily: "LeagueSpartan_700Bold",
    color: "white",
  },

  customAmountRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },

  currencyPrefix: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 18,
    color: colors.text,
    marginRight: 8,
  },

  customAmountInput: {
    flex: 1,
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 18,
    color: colors.text,
  },

  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.inputBackground,
    borderRadius: 15,
    padding: 16,
    marginBottom: 30,
  },

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.text,
    alignItems: "center",
    justifyContent: "center",
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.text,
  },
});
