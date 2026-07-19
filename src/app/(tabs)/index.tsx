import { globalStyles } from "@/styles/global";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";


import { speakText } from '../../services/voiceService';

import { useEffect, useState } from "react";

import Flashcard from "../../components/showquestions";

import { getDailyFlashcard } from "../../services/flashcardService";

import QuoteCard from "@/components/quotecards";
import { getTodaysQuote } from "@/services/quoteService";

 
export default function Homescreen() {
console.log("HOME SCREEN LOADED");

const todaysQuote = getTodaysQuote();

 const [question, setQuestion] = useState<any>(null);


  useEffect(() => {

    // Gets the question of the day
    const dailyQuestion = getDailyFlashcard();

    setQuestion(dailyQuestion);

  }, []);



return(

  
   <ScrollView
      style={{
        marginTop: 50,
       flex: 1,
    padding: 20,
      }}
    >

      <QuoteCard quote={todaysQuote.quote} />

      <TouchableOpacity
        style={{ backgroundColor: '#007AFF', borderRadius: 8}}
        onPress={() =>
          speakText(
            "Hola Ashley, aqui esta la prueba de voz para la aplicacion"
          )
        }>
          <Text style= {{color:"white", fontFamily:globalStyles.title.fontFamily}}>🔉Hola Ashley, aqui esta la prueba de voz para la aplicacion. Hola Ashley, aqui esta la prueba de voz para la aplicacion. Hola Ashley, aqui esta la prueba de voz para la aplicacion</Text>
      </TouchableOpacity>

       <View >
{
question &&

<Flashcard data={question}

/>

}

    </View>

    </ScrollView>
    
)

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent:"center",
    backgroundColor: "#cff7ff",
    padding: 10,
    //paddingTop: 10,
    //paddingLeft:20
    //paddingHorizontal: 10
  },
  text: {
    fontSize: 23,
    fontWeight: "bold",
    fontFamily: "LeagueSpartan_700Bold",
  },
   title: {
    color: "blue",
    fontWeight:"bold",
    fontFamily: "LeagueSpartan_400Regular",
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  
  
});