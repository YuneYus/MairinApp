import { speakText } from "@/services/voiceService";
import { getAudioLanguage } from "@/storage/audioLanguageStorage";
import { AppLanguage } from "@/storage/languageStorage";

export async function speakIfEnabled(
  text: string,
  currentLanguage: AppLanguage
) {
  const audioPref = await getAudioLanguage();

  if (audioPref === "none") return;

  if (currentLanguage === "es") {
    speakText(text, "es-ES");
    return;
  }

  if (currentLanguage === "mis") {
    speakText(text, "es-ES");
    return;
  }
}