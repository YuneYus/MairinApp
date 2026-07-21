// app/chat-mairin.tsx

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
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

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Escribe un mensaje..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={loading}
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

  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0DCE4",
    gap: 10,
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