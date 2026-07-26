// components/SpeakableText.tsx

import { useLanguage } from "@/contexts/LanguageContext";
import { speakIfEnabled } from "@/hooks/useSpeak";
import { colors } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";

export default function SpeakableText({
  text,
  style,
  iconSize = 15,
}: {
  text: string;
  style?: any;
  iconSize?: number;
}) {
  const { language } = useLanguage();
  const showSpeakerIcons = language === "es";

  return (
    <Text style={style}>
      {text}
      {showSpeakerIcons && (
        <>
          {" "}
          <Text onPress={() => speakIfEnabled(text, language)} suppressHighlighting>
            <Ionicons name="volume-medium" size={iconSize} color={colors.text} />
          </Text>
        </>
      )}
    </Text>
  );
}