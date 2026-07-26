// hooks/useSpeak.ts

import { speakText } from "@/services/voiceService";
import { getAudioLanguage } from "@/storage/audioLanguageStorage";
import { AppLanguage } from "@/storage/languageStorage";

export async function speakIfEnabled(text: string, currentLanguage: AppLanguage) {
  if (currentLanguage !== "es") return;

  const audioPref = await getAudioLanguage();
  if (audioPref !== "none") {
    speakText(text);
  }
}