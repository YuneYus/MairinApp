// app/(tabs)/Apoyanos/donar.tsx

import { useLanguage } from "@/contexts/LanguageContext";
import { speakIfEnabled } from "@/hooks/useSpeak";
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
  const { t, language } = useLanguage();
  const showSpeakerIcons = language === "es";

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

        <View style={styles.titleRow}>
          <Text style={globalStyles.pinkHeaderTitle}>{t("quieroDonarTitle")}</Text>
          {showSpeakerIcons && (
            <TouchableOpacity
              onPress={() => speakIfEnabled(t("quieroDonarTitle"), language)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="volume-medium"
                size={20}
                color={colors.text}
                style={styles.speakerIcon}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={globalStyles.content}>
        <View style={styles.descriptionWrapper}>
          <Text style={globalStyles.textNormal}>{t("donarTexto")}</Text>

          {showSpeakerIcons && (
            <TouchableOpacity
              style={styles.descriptionSpeaker}
              onPress={() => speakIfEnabled(t("donarTexto"), language)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="volume-medium" size={18} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>

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
            placeholder={t("EscribeElMonto")}
            placeholderTextColor={colors.text}
            keyboardType="numeric"
            value={customAmount}
            onChangeText={(text) => {
              setCustomAmount(text);
              setSelectedAmount(null);
            }}
          />
        </View>

        <View style={styles.labelRow}>
          <Text style={globalStyles.label}>{t("formaDePago")}</Text>
          {showSpeakerIcons && (
            <TouchableOpacity
              onPress={() => speakIfEnabled(t("formaDePago"), language)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="volume-medium"
                size={16}
                color={colors.text}
                style={styles.speakerIconSmall}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.paymentOption}>
          <Ionicons name="card-outline" size={22} color={colors.text} />
          <Text style={globalStyles.textNormal}>{t("pagarTarjeta")}</Text>
          {showSpeakerIcons && (
            <TouchableOpacity
              onPress={() => speakIfEnabled(t("pagarTarjeta"), language)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="volume-medium" size={16} color={colors.text} />
            </TouchableOpacity>
          )}
          <View style={styles.radioOuter}>
            <View style={styles.radioInner} />
          </View>
        </View>

        <TouchableOpacity style={globalStyles.pillButton} onPress={handleDonarAhora}>
          <Text style={globalStyles.pillButtonText}>{t("donarAhora")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  titleRow: { flexDirection: "row", alignItems: "center" },
  speakerIcon: { marginLeft: 8 },
  speakerIconSmall: { marginLeft: 6 },

  descriptionWrapper: { marginTop: 0, marginBottom: 20 },
  descriptionSpeaker: { marginTop: 8, alignSelf: "flex-start" },

  labelRow: { flexDirection: "row", alignItems: "center" },

  amountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 0,
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
    marginLeft: "auto",
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.text,
  },
});