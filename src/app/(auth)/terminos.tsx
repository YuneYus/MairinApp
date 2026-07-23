

// app/(auth)/terminos.tsx

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TerminosScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#B0195B" />
        </TouchableOpacity>

        <Text style={styles.title}>Política De Privacidad</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.updated}>Última Actualización: 18/07/2026</Text>

        <Text style={styles.sectionTitle}>1. Introducción</Text>
        <Text style={styles.paragraph}>
          Bienvenida a Mairin, una aplicación creada para acompañar a las mujeres en las diferentes etapas de su vida mediante herramientas digitales, información confiable y recursos educativos relacionados con su bienestar y salud.
        </Text>
        <Text style={styles.paragraph}>
          Al utilizar Mairin, aceptas los términos descritos en esta Política de Privacidad y Términos y Condiciones. Nuestro compromiso es proteger tu información y ofrecer una experiencia segura, accesible y personalizada.
        </Text>

        <Text style={styles.sectionTitle}>2. Información que recopilamos</Text>
        <Text style={styles.paragraph}>
          Para ofrecer nuestras herramientas y mejorar tu experiencia, Mairin puede recopilar información proporcionada por ti, incluyendo:
        </Text>
        <Text style={styles.bullet}>• Datos relacionados con tu menstruación, como fechas del ciclo, duración, regularidad y síntomas registrados.</Text>
        <Text style={styles.bullet}>• Información relacionada con tu bienestar y salud, como niveles de dolor, cambios físicos, estados de ánimo y notas personales.</Text>
        <Text style={styles.bullet}>• Información básica de la cuenta, cuando sea necesaria para utilizar ciertas funciones de la aplicación.</Text>
        <Text style={styles.bullet}>• Datos técnicos de uso de la aplicación para mejorar su funcionamiento y seguridad.</Text>
        <Text style={styles.paragraph}>
          Mairin únicamente recopila la información necesaria para brindar sus servicios y mejorar la experiencia de sus usuarias.
        </Text>

        <Text style={styles.sectionTitle}>3. Uso de la información</Text>
        <Text style={styles.paragraph}>La información recopilada puede utilizarse para:</Text>
        <Text style={styles.bullet}>• Ayudarte a realizar seguimiento de tu ciclo menstrual.</Text>
        <Text style={styles.bullet}>• Identificar patrones de regularidad o cambios en tus registros.</Text>
        <Text style={styles.bullet}>• Proporcionar recordatorios, recomendaciones generales y contenido educativo.</Text>
        <Text style={styles.bullet}>• Mejorar las funciones, seguridad y rendimiento de la aplicación.</Text>
        <Text style={styles.bullet}>• Desarrollar nuevos recursos que beneficien a las usuarias.</Text>
        <Text style={styles.paragraph}>
          La información proporcionada no será utilizada para diagnosticar condiciones médicas ni sustituye la atención de profesionales de salud.
        </Text>

        <Text style={styles.sectionTitle}>4. Protección de tus datos</Text>
        <Text style={styles.paragraph}>
          Mairin implementa medidas de seguridad para proteger la información personal de sus usuarias y evitar accesos no autorizados.
        </Text>
        <Text style={styles.paragraph}>
          Tu información de salud es privada y será tratada con confidencialidad. No venderemos ni compartiremos tus datos personales con terceros para fines comerciales sin tu consentimiento.
        </Text>

        <Text style={styles.sectionTitle}>5. Compartir información</Text>
        <Text style={styles.paragraph}>Mairin podrá compartir información únicamente cuando sea necesario para:</Text>
        <Text style={styles.bullet}>• Cumplir obligaciones legales.</Text>
        <Text style={styles.bullet}>• Proteger la seguridad de la aplicación y sus usuarias.</Text>
        <Text style={styles.bullet}>• Trabajar con proveedores tecnológicos que ayuden al funcionamiento del servicio bajo medidas de protección adecuadas.</Text>

        <Text style={styles.sectionTitle}>6. Control de tus datos</Text>
        <Text style={styles.paragraph}>Puedes solicitar:</Text>
        <Text style={styles.bullet}>• Acceder a la información que has registrado.</Text>
        <Text style={styles.bullet}>• Corregir tus datos.</Text>
        <Text style={styles.bullet}>• Eliminar tu cuenta y la información asociada.</Text>
        <Text style={styles.bullet}>• Dejar de utilizar la aplicación en cualquier momento.</Text>

        <Text style={styles.mainTitle}>Términos Y Condiciones</Text>

        <Text style={styles.sectionTitle}>1. Uso de la aplicación</Text>
        <Text style={styles.paragraph}>
          Mairin está diseñada para brindar información, acompañamiento y herramientas de seguimiento relacionadas con la salud femenina. Al utilizar la aplicación, aceptas:
        </Text>
        <Text style={styles.bullet}>• Proporcionar información verdadera y actualizada.</Text>
        <Text style={styles.bullet}>• Utilizar la aplicación de manera responsable.</Text>
        <Text style={styles.bullet}>• No intentar afectar la seguridad o funcionamiento de la plataforma.</Text>

        <Text style={styles.sectionTitle}>2. Información de salud</Text>
        <Text style={styles.paragraph}>
          La información proporcionada dentro de Mairin tiene fines educativos y de acompañamiento. Mairin no reemplaza consultas médicas, diagnósticos ni tratamientos profesionales. Si tienes dudas o preocupaciones sobre tu salud, recomendamos consultar con un profesional de la salud.
        </Text>

        <Text style={styles.sectionTitle}>3. Cuenta y seguridad</Text>
        <Text style={styles.paragraph}>
          Si creas una cuenta en Mairin, eres responsable de mantener la confidencialidad de tus datos de acceso y del uso que se haga de tu cuenta.
        </Text>

        <Text style={styles.sectionTitle}>4. Propiedad intelectual</Text>
        <Text style={styles.paragraph}>
          Todo el contenido de Mairin, incluyendo diseño, textos, gráficos, herramientas y recursos, pertenece a Mairin o cuenta con los permisos correspondientes para su uso. No está permitido copiar, modificar o distribuir contenido de la aplicación sin autorización previa.
        </Text>

        <Text style={styles.sectionTitle}>5. Cambios en los términos</Text>
        <Text style={styles.paragraph}>
          Mairin puede actualizar esta Política de Privacidad y Términos y Condiciones para mejorar sus servicios o cumplir con cambios legales. Las modificaciones importantes serán comunicadas dentro de la aplicación.
        </Text>

        <Text style={styles.sectionTitle}>6. Contacto</Text>
        <Text style={styles.paragraph}>
          Si tienes preguntas sobre nuestra Política de Privacidad o Términos y Condiciones, puedes contactarnos:
        </Text>
        <Text style={styles.paragraph}>Correo electrónico: mairincontacto@mairin.com</Text>
        <Text style={[styles.paragraph, { fontWeight: "bold" }]}>Mairin</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },

  header: {
    backgroundColor: "#F6C6D6",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 60,
    paddingBottom: 24,
    alignItems: "center",
  },
  backButton: { position: "absolute", top: 60, left: 20 },
  title: { fontSize: 20, fontWeight: "bold", color: "#B0195B" },

  content: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },

  updated: { fontSize: 12, color: "#B0195B", marginBottom: 16 },

  mainTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#B0195B",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
    marginTop: 18,
    marginBottom: 6,
  },

  paragraph: {
    fontSize: 13.5,
    color: "#444",
    lineHeight: 19,
    marginBottom: 8,
  },

  bullet: {
    fontSize: 13.5,
    color: "#444",
    lineHeight: 19,
    marginBottom: 4,
    marginLeft: 6,
  },
});