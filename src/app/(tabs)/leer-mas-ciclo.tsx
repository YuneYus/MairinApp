// app/(tabs)/leer-mas-ciclo.tsx

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors, globalStyles } from "@/styles/global";

const IRREGULAR_SIGNS = [
  "Tu período llega antes de 21 días o después de 35 días",
  "Cambia mucho de un mes a otro.",
  "Deja de llegar durante varios meses",
  "Tu período llega antes de 21 días o después de 35 días",
  "Presentas cambios importantes en el sangrado o la duración de tu período.",
];

const POSSIBLE_CAUSES = [
  {
    title: "Hormonales",
    body: "Los cambios en tus hormonas pueden hacer que tu período llegue antes, después o que cambie con el tiempo.",
  },
  {
    title: "Estilo de vida",
    body: "El estrés, dormir poco, bajar o subir de peso rápidamente y hacer mucho ejercicio pueden afectar tu ciclo menstrual.",
  },
  {
    title: "Anticoncepción y medicamentos",
    body: "Empezar, dejar o cambiar un método anticonceptivo, así como algunos medicamentos, puede hacer que tu período sea diferente.",
  },
  {
    title: "Estructurales del útero",
    body: "Algunas condiciones del útero pueden causar cambios en la duración, la cantidad de sangrado o el dolor durante la menstruación.",
  },
  {
    title: "Otras",
    body: "El embarazo, la lactancia o algunas enfermedades también pueden provocar cambios en tu período.",
  },
];

const DOCTOR_SIGNS = [
  {
    title: "Sangras más o sangras menos que antes",
    body: 'Pasa porque las hormonas (los mensajeros que controlan el ciclo) suben y bajan distinto ese mes.',
  },
  {
    title: "Manchas de sangre fuera de tu periodo",
    body: 'Pasa porque las hormonas (los mensajeros que controlan el ciclo) suben y bajan distinto ese mes.',
  },
  {
    title: "Colicos mas fuertes que de costumbre",
    body: "El utero se aprieta con mas fuerza para botar la sangre, o puede haber bultos o tejido creciendo donde no debe.",
  },
  {
    title: "Senos sensibles, hinchazon, cambios de animo",
    body: "Es normal sentir esto antes de la regla, pero se siente mas fuerte cuando el ciclo esta desordenado.",
  },
  {
    title: "Acne, mas vello, se te cae el pelo",
    body: 'Puede ser que el cuerpo tiene mas hormonas de tipo "masculino" de lo normal.',
  },
  {
    title: "Cansancio, cambios de peso, mucho frio o calor",
    body: "Puede ser la tiroides, una glandulita en el cuello que ayuda a controlar el cuerpo y tambien el ciclo.",
  },
  {
    title: "Calores repentinos, sudor de noche, sequedad",
    body: "Si tienes entre 40 y 50 años, puede ser que te estas acercando a la menopausia, cuando la regla se va terminando poco a poco.",
  },
];

export default function LeerMasCicloScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={globalStyles.pinkHeaderTitle}>Leer Mas De Tu Ciclo</Text>
      </View>

      {/* ¿Cuándo se considera irregular? */}
      <View style={styles.sectionCard}>
        <Text style={globalStyles.label}>¿Cuándo se considera irregular?</Text>
      </View>

      {IRREGULAR_SIGNS.map((sign, index) => (
        <View key={index} style={styles.signRow}>
          <View style={styles.arrowCircle}>
            <Ionicons name="arrow-forward" size={16} color={colors.text} />
          </View>
          <Text style={[globalStyles.textNormal, styles.signText]}>{sign}</Text>
        </View>
      ))}

      {/* Posible causas */}
      <View style={styles.sectionCard}>
        <Text style={globalStyles.label}>Posible causas</Text>
      </View>

      <View style={styles.paragraphCard}>
        <Text style={[globalStyles.textNormal, styles.paragraphText]}>
          Un ciclo irregular puede deberse a cambios hormonales, de estilo de
          vida, medicamentos, o factores estructurales del útero. Aquí un
          resumen para orientarte.
        </Text>
      </View>

      {POSSIBLE_CAUSES.map((cause, index) => (
        <View key={index} style={styles.itemRow}>
          <View style={styles.dot} />
          <View style={styles.itemTextBlock}>
            <Text style={[globalStyles.textNormal, styles.itemTitle]}>{cause.title}</Text>
            <Text style={[globalStyles.textNormal, styles.itemBody]}>{cause.body}</Text>
          </View>
        </View>
      ))}

      <View style={styles.noteCard}>
        <View style={styles.dot} />
        <Text style={[globalStyles.textNormal, styles.noteText]}>
          Recuerda: Es normal que tu ciclo cambie algunas veces. Si notas
          cambios frecuentes o importantes, es recomendable consultar con un
          profesional de la salud.
        </Text>
      </View>

      {/* Cuándo ver a un médico */}
      <View style={[styles.sectionCard, { marginTop: 30 }]}>
        <Text style={globalStyles.label}>Cuando ver a un médico si...</Text>
      </View>

      <View style={styles.paragraphCard}>
        <Text style={[globalStyles.textNormal, styles.paragraphText]}>
          Un ciclo irregular puede deberse a cambios hormonales, de estilo de
          vida, medicamentos, o factores estructurales del útero. Aquí un
          resumen para orientarte.
        </Text>
      </View>

      {DOCTOR_SIGNS.map((sign, index) => (
        <View key={index} style={styles.itemRow}>
          <View style={styles.dotLight} />
          <View style={styles.itemTextBlock}>
            <Text style={[globalStyles.textNormal, styles.itemTitle]}>{sign.title}</Text>
            <Text style={[globalStyles.textNormal, styles.itemBody]}>{sign.body}</Text>
          </View>
        </View>
      ))}

      <View style={styles.noteCard}>
        <View style={styles.dotLight} />
        <Text style={[globalStyles.textNormal, styles.noteText]}>
          No puedo saber con certeza que tienes sin verte. Cada sintoma puede
          venir de cosas distintas, y solo un medico puede revisarte y
          decirte que es.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 40 },

  header: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
  },
  backButton: { position: "absolute", top: 60, left: 20 },

  sectionCard: {
    marginHorizontal: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: colors.text,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },

  signRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginHorizontal: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 16,
    padding: 14,
  },
  arrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: colors.text,
    alignItems: "center",
    justifyContent: "center",
  },
  signText: { flex: 1, minWidth: 0 },

  paragraphCard: {
    marginHorizontal: 20,
    marginTop: 14,
  },
  paragraphText: { color: "#444", lineHeight: 22 },

  itemRow: {
    flexDirection: "row",
    gap: 14,
    marginHorizontal: 20,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 16,
    padding: 14,
    alignItems: "flex-start",
  },
  dot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    marginTop: 2,
  },
  dotLight: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.inputBackground,
    marginTop: 2,
  },
  itemTextBlock: { flex: 1, minWidth: 0 },
  itemTitle: { marginBottom: 4 },
  itemBody: { color: "#555", lineHeight: 21 },

  noteCard: {
    flexDirection: "row",
    gap: 14,
    marginHorizontal: 20,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 16,
    padding: 14,
    alignItems: "flex-start",
  },
  noteText: { flex: 1, minWidth: 0, color: "#555", lineHeight: 21 },
});