import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { speakText } from "@/services/voiceService";
import { colors, globalStyles } from "@/styles/global"; // adjust path if needed
import { useState } from "react";

interface FlashcardData {
  question: string;
  answer: boolean;
  explanation: string;
}

interface Props {
  data: FlashcardData;
}

export default function Flashcard({ data }: Props) {
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);

  function checkAnswer(userAnswer: boolean) {
    if (userAnswer === data.answer) {
      setResult("correct");
    } else {
      setResult("incorrect");
    }
  }

  return (
    <View style={styles.card}>
      <Text style={globalStyles.label}>Mitos</Text>

      <View style={styles.iconWrapper}>
        {result === null && (
          <Image
            source={require("../app/assets/images/mitos.png")}
            style={styles.iconImage}
            resizeMode="contain"
          />
        )}

        {result === "correct" && (
          <Image
            source={require("../app/assets/images/check.png")}
            style={styles.iconImage}
            resizeMode="contain"
          />
        )}

        {result === "incorrect" && (
          <Image
            source={require("../app/assets/images/x.png")}
            style={styles.iconImage}
            resizeMode="contain"
          />
        )}
      </View>

      {/* Voice button */}
      <TouchableOpacity
        style={styles.voiceButton}
        onPress={() => speakText(data.question)}
      >
        <Text style={[globalStyles.textNormal, styles.voiceText]}>
          🔊 {data.question}
        </Text>
      </TouchableOpacity>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.trueButton, result !== null && styles.buttonDisabled]}
          onPress={() => checkAnswer(true)}
          disabled={result !== null}
        >
          <Text style={styles.buttonText}>Verdadero</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.falseButton, result !== null && styles.buttonDisabled]}
          onPress={() => checkAnswer(false)}
          disabled={result !== null}
        >
          <Text style={styles.buttonText}>Falso</Text>
        </TouchableOpacity>
      </View>

      {result && (
        <View style={styles.result}>
          <Text
            style={[
              globalStyles.textNormal,
              result === "correct" ? styles.correctText : styles.incorrectText,
            ]}
          >
            {data.explanation}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    width: "100%",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.header,
  },

  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  iconImage: {
    width: 100,
    height: 100,
  },

  voiceButton: {
    marginBottom: 20,
    backgroundColor: colors.inputBackground,
    padding: 12,
    borderRadius: 16,
    width: "100%",
  },

  voiceText: {
    textAlign: "center",
  },

  buttons: {
    flexDirection: "row",
    gap: 20,
  },

  trueButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 24,
    width: 120,
    alignItems: "center",
  },

  falseButton: {
    backgroundColor: "#F44336",
    padding: 15,
    borderRadius: 24,
    width: 120,
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    fontFamily: "LeagueSpartan_700Bold",
    color: "white",
    fontSize: 16,
  },

  result: {
    marginTop: 25,
    alignItems: "center",
  },

  explanation: {
    fontFamily: "LeagueSpartan_600SemiBold",
    textAlign: "center",
    fontSize: 15,
    lineHeight: 20,
  },

  correctText: {
    color: "#2e7d32",
  },

  incorrectText: {
    color: "#c62828",
  },
});