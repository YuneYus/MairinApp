import { StyleSheet } from "react-native";

export const colors = {
    background: "rgb(255, 255, 255)",
    inputBackground: "#FFEBF0",
    header: "black",
    surface: "#FCBBCB",
    primary: "white",
    text: "#A4195B",
    textSecondary: "black",
    alert:"yellow",

};

export const globalStyles = StyleSheet.create({
container:{
    flex:1,
    backgroundColor:colors.background,
    paddingTop: 60,
    paddingHorizontal:20,
},
title:{
    fontSize: 28,
    fontWeight:"normal",
    color: colors.text,
    fontFamily: "LeagueSpartan_400Regular",

},
sectionTitle:{
    fontSize: 18,
    fontWeight: "600",
    color:colors.textSecondary,
    marginTop: 30,
    marginBottom: 16,
},
  empty: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  input: {
    height: 60,
    borderRadius: 16,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: 16,
    fontSize: 16,
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
    fontStyle:"italic"
  },
  links: {
  color: "red",
  fontStyle: "italic",
  },

})