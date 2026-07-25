// app/(auth)/terminos.tsx

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors, globalStyles } from "@/styles/global";

export default function TerminosScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={globalStyles.pinkHeaderTitle}>Política De Privacidad</Text>
      </View>

      <ScrollView style={globalStyles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.updated}>Última Actualización: 18/07/2026</Text>

        <Text style={styles.sectionTitle}>1. Introducción</Text>
        <Text style={styles.paragraph}>
          Bienvenida a Mairin, una aplicación creada para acompañar a las mujeres en las diferentes etapas de su vida mediante herramientas digitales, información confiable y recursos educativos relacionados con su bienestar y salud.
        </Text>
        <Text style={styles.miskito}>
          Aisanka Kupia kumi Mairin ra, wan aplikasion daukan mairka nani ra wark takaia dia diara ba wina, digital tuls, sut lâka informacion, bara skul lâka diara nani wellbeing bara health laka ra pana takan.
        </Text>
        <Text style={styles.paragraph}>
          Al utilizar Mairin, aceptas los términos descritos en esta Política de Privacidad y Términos y Condiciones. Nuestro compromiso es proteger tu información y ofrecer una experiencia segura, accesible y personalizada.
        </Text>
        <Text style={styles.miskito}>
          Man Mairin app ba yus munaia taim, man lâka nani ba aitani, sika ba Política de Privacidad bara Términos y Condiciones nani ra bri. Wan compromiso ba – man informacion ba luan mai balaia, bara wan seguro, sut lâka, bara personal wark experiencia daukaia.
        </Text>

        <Text style={styles.sectionTitle}>2. Información que recopilamos</Text>
        <Text style={styles.paragraph}>
          Para ofrecer nuestras herramientas y mejorar tu experiencia, Mairin puede recopilar información proporcionada por ti, incluyendo:
        </Text>
        <Text style={styles.miskito}>
          Man tools nani mihta wal experiencia mas pain daukaia dukyara, Mairin ba man wina informacion nani kaikaia sip:
        </Text>

        <Text style={styles.bullet}>• Datos relacionados con tu menstruación, como fechas del ciclo, duración, regularidad y síntomas registrados.</Text>
        <Text style={styles.bulletMiskito}>• Man cycle laka wina data nani, aiska ban, duración, regularidad, bara síntomas kum kum sika ban.</Text>

        <Text style={styles.bullet}>• Información relacionada con tu bienestar y salud, como niveles de dolor, cambios físicos, estados de ánimo y notas personales.</Text>
        <Text style={styles.bulletMiskito}>• Man wellbeing bara health laka wina informacion, dolor levels, wina cambios físico, mood, bara notas personal.</Text>

        <Text style={styles.bullet}>• Información básica de la cuenta, cuando sea necesaria para utilizar ciertas funciones de la aplicación.</Text>
        <Text style={styles.bulletMiskito}>• Cuenta basic informacion, taim man app funciones kum yus munaia need takan pyua.</Text>

        <Text style={styles.bullet}>• Datos técnicos de uso de la aplicación para mejorar su funcionamiento y seguridad.</Text>
        <Text style={styles.bulletMiskito}>• App yus munaia data técnico, funcionamiento bara seguridad mas pain daukaia dukyara.</Text>

        <Text style={styles.paragraph}>
          Mairin únicamente recopila la información necesaria para brindar sus servicios y mejorar la experiencia de sus usuarias.
        </Text>
        <Text style={styles.miskito}>
          Mairin ba pat aisi man informacion need takan ba kaikisa, wan servicio ba man ra mangkaia bara usuaria nani experiencia mas pain daukaia dukyara.
        </Text>

        <Text style={styles.sectionTitle}>3. Uso de la información</Text>
        <Text style={styles.paragraph}>La información recopilada puede utilizarse para:</Text>
        <Text style={styles.miskito}>Informacion kaikan ba nahki yus munisa:</Text>

        <Text style={styles.bullet}>• Ayudarte a realizar seguimiento de tu ciclo menstrual.</Text>
        <Text style={styles.bulletMiskito}>• Man cycle menstrual ba seguimiento munaia dukyara.</Text>

        <Text style={styles.bullet}>• Identificar patrones de regularidad o cambios en tus registros.</Text>
        <Text style={styles.bulletMiskito}>• Man data nani ra regularidad patron o cambio nani lukaia dukyara.</Text>

        <Text style={styles.bullet}>• Proporcionar recordatorios, recomendaciones generales y contenido educativo.</Text>
        <Text style={styles.bulletMiskito}>• Recordatorio nani, sut recomendacion nani, bara contenido educativo mangkaia dukyara.</Text>

        <Text style={styles.bullet}>• Mejorar las funciones, seguridad y rendimiento de la aplicación.</Text>
        <Text style={styles.bulletMiskito}>• App funciones, seguridad bara rendimiento mas pain daukaia dukyara.</Text>

        <Text style={styles.bullet}>• Desarrollar nuevos recursos que beneficien a las usuarias.</Text>
        <Text style={styles.bulletMiskito}>• Usuaria nani ra benefisio takaia dukyara tuls raya nani daukaia dukyara.</Text>

        <Text style={styles.paragraph}>
          La información proporcionada no será utilizada para diagnosticar condiciones médicas ni sustituye la atención de profesionales de salud.
        </Text>
        <Text style={styles.miskito}>
          Informacion kaikan ba diagnostico médico daukaia apia, bara profesional salud laka wina atención ba sustituir apia sip.
        </Text>

        <Text style={styles.sectionTitle}>4. Protección de tus datos</Text>
        <Text style={styles.paragraph}>
          Mairin implementa medidas de seguridad para proteger la información personal de sus usuarias y evitar accesos no autorizados.
        </Text>
        <Text style={styles.miskito}>
          Mairin ba seguridad medida nani daukisa usuaria personal informacion ba proteger munaia dukyara, bara access apia takan nani ra prevenir munaia dukyara.
        </Text>
        <Text style={styles.paragraph}>
          Tu información de salud es privada y será tratada con confidencialidad. No venderemos ni compartiremos tus datos personales con terceros para fines comerciales sin tu consentimiento.
        </Text>
        <Text style={styles.miskito}>
          Man health informacion ba privado bara confidencial laka ra bri kaikbia. Wan man datos personal ba wal sat nani ra atkaia apia, comercial fin nani dukyara, man consentimiento apia takan taim.
        </Text>

        <Text style={styles.sectionTitle}>5. Compartir información</Text>
        <Text style={styles.paragraph}>Mairin podrá compartir información únicamente cuando sea necesario para:</Text>
        <Text style={styles.miskito}>Mairin ba informacion bri sharing munaia sip taim need takan:</Text>

        <Text style={styles.bullet}>• Cumplir obligaciones legales.</Text>
        <Text style={styles.bulletMiskito}>• Lâka obligacion nani cumplir munaia dukyara.</Text>

        <Text style={styles.bullet}>• Proteger la seguridad de la aplicación y sus usuarias.</Text>
        <Text style={styles.bulletMiskito}>• App bara usuaria nani seguridad ba proteger munaia dukyara.</Text>

        <Text style={styles.bullet}>• Trabajar con proveedores tecnológicos que ayuden al funcionamiento del servicio bajo medidas de protección adecuadas.</Text>
        <Text style={styles.bulletMiskito}>• Proveedor tecnológico nani wal wark takaia dukyara, servicio funcionamiento ba proteccion medida adecuado wina.</Text>

        <Text style={styles.sectionTitle}>6. Control de tus datos</Text>
        <Text style={styles.paragraph}>Puedes solicitar:</Text>
        <Text style={styles.miskito}>Man aisi sip:</Text>

        <Text style={styles.bullet}>• Acceder a la información que has registrado.</Text>
        <Text style={styles.bulletMiskito}>• Man registrado takan informacion ba kaikaia.</Text>

        <Text style={styles.bullet}>• Corregir tus datos.</Text>
        <Text style={styles.bulletMiskito}>• Man datos ba corregir munaia.</Text>

        <Text style={styles.bullet}>• Eliminar tu cuenta y la información asociada.</Text>
        <Text style={styles.bulletMiskito}>• Man cuenta bara informacion asosiada ba dukbaia.</Text>

        <Text style={styles.bullet}>• Dejar de utilizar la aplicación en cualquier momento.</Text>
        <Text style={styles.bulletMiskito}>• App yus munaia ba swin taim leaviaia.</Text>

        <Text style={styles.mainTitle}>Términos Y Condiciones</Text>
        <Text style={[styles.miskito, { textAlign: "center", marginTop: -6, marginBottom: 10 }]}>
          Términos Y Condiciones
        </Text>

        <Text style={styles.sectionTitle}>1. Uso de la aplicación</Text>
        <Text style={styles.paragraph}>
          Mairin está diseñada para brindar información, acompañamiento y herramientas de seguimiento relacionadas con la salud femenina. Al utilizar la aplicación, aceptas:
        </Text>
        <Text style={styles.miskito}>
          Mairin ba daukan informacion, acompañamiento, bara seguimiento tuls nani mangkaia dukyara, mairka salud laka ra pana takan. Man app ba yus munaia taim, man aitani:
        </Text>

        <Text style={styles.bullet}>• Proporcionar información verdadera y actualizada.</Text>
        <Text style={styles.bulletMiskito}>• Informacion baiwan bara actualizado mangkaia.</Text>

        <Text style={styles.bullet}>• Utilizar la aplicación de manera responsable.</Text>
        <Text style={styles.bulletMiskito}>• App ba responsable laka ra yus munaia.</Text>

        <Text style={styles.bullet}>• No intentar afectar la seguridad o funcionamiento de la plataforma.</Text>
        <Text style={styles.bulletMiskito}>• App seguridad o funcionamiento ba afectar munaia apia.</Text>

        <Text style={styles.sectionTitle}>2. Información de salud</Text>
        <Text style={styles.paragraph}>
          La información proporcionada dentro de Mairin tiene fines educativos y de acompañamiento. Mairin no reemplaza consultas médicas, diagnósticos ni tratamientos profesionales. Si tienes dudas o preocupaciones sobre tu salud, recomendamos consultar con un profesional de la salud.
        </Text>
        <Text style={styles.miskito}>
          Mairin ra informacion mangkan ba fines educativo bara acompañamiento dukyara baman. Mairin ba consulta médico, diagnóstico, o tratamiento profesional ba reemplazar apia sip. Man health laka ra duda o preocupación bri kaba, profesional salud kum wal consultar munaia recomendar wisa.
        </Text>

        <Text style={styles.sectionTitle}>3. Cuenta y seguridad</Text>
        <Text style={styles.paragraph}>
          Si creas una cuenta en Mairin, eres responsable de mantener la confidencialidad de tus datos de acceso y del uso que se haga de tu cuenta.
        </Text>
        <Text style={styles.miskito}>
          Man Mairin ra cuenta kum daukan kaba, man responsable laka ra bri, man datos acceso bara cuenta yus munanka ba confidencial laka ra kaikaia dukyara.
        </Text>

        <Text style={styles.sectionTitle}>4. Propiedad intelectual</Text>
        <Text style={styles.paragraph}>
          Todo el contenido de Mairin, incluyendo diseño, textos, gráficos, herramientas y recursos, pertenece a Mairin o cuenta con los permisos correspondientes para su uso. No está permitido copiar, modificar o distribuir contenido de la aplicación sin autorización previa.
        </Text>
        <Text style={styles.miskito}>
          Mairin content sut ba, diseño, texto, gráfico, tuls, bara recursos nani baku, Mairin property laka ra bri o permiso correspondiente ba bri yus munaia dukyara. App content ba copy, cambio, o distribuir munaia apia sip, autorización pyua takan without.
        </Text>

        <Text style={styles.sectionTitle}>5. Cambios en los términos</Text>
        <Text style={styles.paragraph}>
          Mairin puede actualizar esta Política de Privacidad y Términos y Condiciones para mejorar sus servicios o cumplir con cambios legales. Las modificaciones importantes serán comunicadas dentro de la aplicación.
        </Text>
        <Text style={styles.miskito}>
          Mairin ba Política de Privacidad bara Términos y Condiciones ba update munaia sip, servicio mas pain daukaia dukyara o lâka cambio nani cumplir munaia dukyara. Cambio importante nani ba app baman ra comunicar kabia.
        </Text>

        <Text style={styles.sectionTitle}>6. Contacto</Text>
        <Text style={styles.paragraph}>
          Si tienes preguntas sobre nuestra Política de Privacidad o Términos y Condiciones, puedes contactarnos:
        </Text>
        <Text style={styles.miskito}>
          Question bri kaba man Política de Privacidad o Términos y Condiciones laka ra, contact wamna:
        </Text>
        <Text style={styles.paragraph}>Correo electrónico: mairincontacto@mairin.com</Text>
        <Text style={styles.miskito}>Email: mairincontacto@mairin.com</Text>
        <Text style={[styles.paragraph, { fontFamily: "LeagueSpartan_700Bold" }]}>Mairin</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 60,
    paddingBottom: 24,
    alignItems: "center",
  },
  backButton: { position: "absolute", top: 60, left: 20 },

  updated: {
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },

  mainTitle: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 20,
    color: colors.text,
    textAlign: "center",
    marginTop: 30,
    marginBottom: 4,
  },

  sectionTitle: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 18,
    marginBottom: 6,
  },

  paragraph: {
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 16,
    color: "#444",
    lineHeight: 20,
    marginBottom: 2,
  },

  miskito: {
    fontFamily: "LeagueSpartan_400Regular",
    fontStyle: "italic",
    fontSize: 16,
    color: colors.text,
    lineHeight: 18,
    marginBottom: 10,
  },

  bullet: {
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 16,
    color: "#444",
    lineHeight: 20,
    marginBottom: 1,
    marginLeft: 6,
  },

  bulletMiskito: {
    fontFamily: "LeagueSpartan_400Regular",
    fontStyle: "italic",
    fontSize: 16,
    color: colors.text,
    lineHeight: 18,
    marginBottom: 6,
    marginLeft: 6,
  },
});