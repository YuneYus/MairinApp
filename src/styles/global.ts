import { StyleSheet } from "react-native";

export const colors = {
    background: "#FFFFFF",
    inputBackground: "#FFEBF0",
    header: "#000000",
    surface: "#FCBBCB",
    primary: "white",
    text: "#A4195B",
    textSecondary: "#000000",
    alert: "yellow",
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  // ---- typography tiers ----

  // Tier 1: normal body text — smallest, regular weight
  textNormal: {
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 18,
    color: colors.textSecondary,
  },

  // Tier 2: field labels — "Nombre", "Teléfono", etc.
  label: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 20,
    color: colors.textSecondary,
    marginTop: 22,
    marginBottom: 8,
  },

  // Tier 3: big screen/tab titles — centered
  titleBig: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 28,
    color: colors.text,
    textAlign: "center",
  },

  // ---- legacy font styles (not League Spartan — confirm if still needed) ----
  LSRegular: {
    fontSize: 28,
    fontWeight: "normal",
    color: colors.text,
    fontFamily: "LeagueSpartan_400Regular",
  },
  LSBold: {
    fontSize: 18,
    fontWeight: "normal",
    color: "black",
    fontFamily: "LeagueSpartan_700Bold",
  },
  OpenSanRegular: {
    fontSize: 28,
    fontWeight: "normal",
    color: colors.text,
    fontFamily: "OpenSans_400Regular",
  },
  OpenSanBold: {
    fontSize: 28,
    fontWeight: "normal",
    color: colors.text,
    fontFamily: "OpenSans_700Bold",
  },
  MonserratRegular: {
    fontSize: 28,
    fontWeight: "normal",
    color: colors.text,
    fontFamily: "Montserrat_400Regular",
  },
  MonserratBold: {
    fontSize: 28,
    fontWeight: "normal",
    color: colors.text,
    fontFamily: "Montserrat_700Bold",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textSecondary,
    marginTop: 30,
    marginBottom: 16,
  },
  empty: {
    fontFamily: "LeagueSpartan_400Regular",
    color: colors.textSecondary,
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  input: {
    height: 60,
    borderRadius: 16,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: 16,
    fontSize: 18,
    color: colors.primary,
  },

  button: {
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  date: {
    fontSize: 15,
    fontStyle: "italic",
  },
  links: {
    color: "red",
    fontStyle: "italic",
  },



  // ---- shared, reused across ayuda screens ----

  pinkHeader: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  pinkHeaderTitle: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 28,
    color: colors.text,
    textAlign: "center",
  },
  backButton: {
    marginBottom: 12,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  placeholderColor:{
    color:"#cf518c"
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBackground,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 16,
    color: colors.textSecondary,
  },

  addButton: {
    backgroundColor: colors.text,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    fontFamily: "LeagueSpartan_700Bold",
    color: "white",
    fontSize: 16,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    marginTop: 20,
  },
  cardTitle: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 20,
    color: "black",
  },
  cardSubtitle: {
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 20,
    color: colors.textSecondary,
    marginTop: 4,
  },
  cardHighlight: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 20,
    color: colors.text,
    marginTop: 8,
  },

  pillButton: {
    backgroundColor: colors.text,
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  pillButtonText: {
    fontFamily: "LeagueSpartan_700Bold",
    color: "white",
    fontSize: 16,
  },

  // ---- form styles (adddoctors, etc.) ----

  formInput: {
    backgroundColor: colors.inputBackground,
    color: colors.text,
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 18,
    padding: 16,
    borderRadius: 15,
  },

  buttonsRow: {
    flexDirection: "row",
    gap: 15,
    marginTop: 30,
    marginBottom: 30,
  },

  actionButton: {
    flex: 1,
    backgroundColor: colors.text,
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  actionButtonText: {
    fontFamily: "LeagueSpartan_700Bold",
    color: "white",
    fontSize: 18,
  },
});