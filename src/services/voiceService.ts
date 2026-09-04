import { Platform } from "react-native";
import * as Speech from "expo-speech";

export const speakText = (
  text: string,
  language: string = "es-ES"
) => {
  console.log("🔊 VOZ:", {
    texto: text,
    idioma: language,
    plataforma: Platform.OS,
  });

  // =========================
  // 🌐 WEB
  // =========================
  if (Platform.OS === "web") {
    if (
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();

      const voices = window.speechSynthesis.getVoices();

      console.log(
        "🎙️ VOCES DISPONIBLES:",
        voices.map((voice) => ({
          nombre: voice.name,
          idioma: voice.lang,
        }))
      );

      // Buscar una voz en español
      const voice =
        voices.find(
          (v) =>
            v.lang.toLowerCase() === "es-mx"
        ) ??
        voices.find(
          (v) =>
            v.lang.toLowerCase() === "es-es"
        ) ??
        voices.find(
          (v) =>
            v.lang.toLowerCase() === "es-us"
        ) ??
        voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith("es")
        );

      const utterance =
        new SpeechSynthesisUtterance(text);

      // Español y Miskito serán leídos
      // utilizando una voz española
      utterance.lang = "es-ES";

      // Usar la voz española encontrada
      if (voice) {
        utterance.voice = voice;

        console.log("🎙️ VOZ SELECCIONADA:", {
          nombre: voice.name,
          idioma: voice.lang,
        });
      } else {
        console.warn(
          "⚠️ No existe una voz española instalada en este navegador."
        );
      }

      // Voz más suave y lenta
      utterance.pitch = 1.08;
      utterance.rate = 0.88;
      utterance.volume = 1;

      window.speechSynthesis.speak(utterance);
    }

    return;
  }

  // =========================
  // 📱 ANDROID / IOS
  // =========================

  Speech.stop();

  Speech.speak(text, {
    // La misma voz española leerá
    // tanto español como Miskito
    language: "es-ES",
    pitch: 1.08,
    rate: 0.88,
  });
};

export const stopSpeaking = () => {
  if (Platform.OS === "web") {
    if (
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }

    return;
  }

  Speech.stop();
};