// Voice utilities

import * as Speech from "expo-speech";

// Speak text
export const speakText = (
  text: string,
  language: string = "es-ES"
) => {
  Speech.stop();

  Speech.speak(text, {
    language,
    pitch: 1,
    rate: 1,
  });
};

// Stop speaking
export const stopSpeaking = () => {
  Speech.stop();
};