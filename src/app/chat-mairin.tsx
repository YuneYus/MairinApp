// app/chat-mairin.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { saveChatSummary } from "@/storage/chatSummaryStorage";

const BACKEND_CHAT_URL = "https://mairin-chat-backend.vercel.app/api/chat";
const BACKEND_SUMMARY_URL = "https://mairin-chat-backend.vercel.app/api/summary";
const BACKEND_TRANSCRIBE_URL = "https://mairin-chat-backend.vercel.app/api/transcribe";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export default function ChatMairinScreen() {
  const { mood } = useLocalSearchParams<{ mood?: string }>();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hola, soy MAIRIN. Estoy aquí para escucharte. ¿Quieres contarme cómo te sientes hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ending, setEnding] = useState(false);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(BACKEND_CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          mood: mood ?? null,
          history: messages.map((m) => ({ role: m.role, content: m.text })),
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        text: data.reply ?? "Lo siento, no pude procesar eso.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.log("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-error`,
          role: "assistant",
          text: "Hubo un problema conectando. Intenta de nuevo en un momento.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEndConversation = async () => {
    if (messages.length <= 1) {
      router.back();
      return;
    }

    setEnding(true);

    try {
      const response = await fetch(BACKEND_SUMMARY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: messages.map((m) => ({ role: m.role, content: m.text })),
        }),
      });

      const data = await response.json();

      if (data.summary) {
        await saveChatSummary(data.summary);
      }
    } catch (error) {
      console.log("Error generating summary:", error);
    } finally {
      setEnding(false);
      router.back();
    }
  };

  const startRecording = async () => {
    try {
      console.log("1. Requesting permission...");
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      console.log("2. Permission result:", permission);

      if (!permission.granted) {
        console.log("Permission not granted, stopping");
        return;
      }

      console.log("3. Setting audio mode...");
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      console.log("4. Preparing to record...");
      await audioRecorder.prepareToRecordAsync();

      console.log("5. Starting record...");
      audioRecorder.record();

      console.log("6. Recording started, setting state");
      setIsRecording(true);
    } catch (error) {
      console.log("ERROR in startRecording:", error);
    }
  };

  const stopRecordingAndTranscribe = async () => {
    console.log("Stopping recording...");
    setIsRecording(false);
    setIsTranscribing(true);

    try {
      await audioRecorder.stop();
      const uri = audioRecorder.uri;
      console.log("Recording URI:", uri);

      if (!uri) {
        console.log("No URI — recording may have failed");
        return;
      }

      // Fetch the local file and convert it into a Blob
      const fileResponse = await fetch(uri);
      const blob = await fileResponse.blob();

      const formData = new FormData();
      formData.append("audio", blob, "recording.m4a");

      console.log("Uploading to:", BACKEND_TRANSCRIBE_URL);

      const response = await fetch(BACKEND_TRANSCRIBE_URL, {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Transcription result:", data);

      if (data.text) {
        setInput((prev) => (prev ? `${prev} ${data.text}` : data.text));
      } else {
        console.log("No text in response:", data);
      }
    } catch (error) {
      console.log("Error transcribing audio:", error);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleMicPress = () => {
    console.log("Mic button pressed, isRecording:", isRecording);
    if (isRecording) {
      stopRecordingAndTranscribe();
    } else {
      startRecording();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#B0195B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Hablar con MAIRIN</Text>

        <TouchableOpacity
          style={styles.endButton}
          onPress={handleEndConversation}
          disabled={ending}
        >
          <Text style={styles.endButtonText}>{ending ? "..." : "Terminar"}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.role === "user" ? styles.userBubble : styles.assistantBubble,
            ]}
          >
            <Text
              style={
                item.role === "user" ? styles.userBubbleText : styles.assistantBubbleText
              }
            >
              {item.text}
            </Text>
          </View>
        )}
      />

      {isTranscribing && (
        <View style={styles.transcribingRow}>
          <ActivityIndicator size="small" color="#B0195B" />
          <Text style={styles.transcribingText}>Transcribiendo...</Text>
        </View>
      )}

      <View style={styles.inputRow}>
        <TouchableOpacity
          style={[styles.micButton, isRecording && styles.micButtonActive]}
          onPress={handleMicPress}
        >
          <Ionicons
            name={isRecording ? "stop" : "mic"}
            size={18}
            color={isRecording ? "white" : "#B0195B"}
          />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder={isRecording ? "Escuchando..." : "Escribe un mensaje..."}
          placeholderTextColor="#999"
          multiline
          editable={!isRecording}
        />

        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={loading || isRecording}
        >
          <Ionicons name="send" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },

  header: {
    backgroundColor: "#F6C6D6",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: { marginRight: 14 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#B0195B" },

  endButton: {
    backgroundColor: "#B0195B",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  endButtonText: { color: "white", fontSize: 13, fontWeight: "bold" },

  messagesList: { padding: 16, paddingBottom: 20 },

  bubble: {
    maxWidth: "80%",
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
  },
  userBubble: {
    backgroundColor: "#B0195B",
    alignSelf: "flex-end",
  },
  assistantBubble: {
    backgroundColor: "#FBDCE7",
    alignSelf: "flex-start",
  },
  userBubbleText: { color: "white", fontSize: 14 },
  assistantBubbleText: { color: "#222", fontSize: 14 },

  transcribingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  transcribingText: { fontSize: 13, color: "#B0195B" },

  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0DCE4",
    gap: 10,
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FBDCE7",
    alignItems: "center",
    justifyContent: "center",
  },
  micButtonActive: {
    backgroundColor: "#E91E63",
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#B0195B",
    alignItems: "center",
    justifyContent: "center",
  },
});