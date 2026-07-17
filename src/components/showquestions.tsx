import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import { speakText } from "@/services/voiceService";
import { useState } from "react";


interface FlashcardData {

  question: string;

  answer: boolean;

  explanation: string;

}


interface Props {

  data: FlashcardData;

}



export default function Flashcard({data}: Props){


  const [result, setResult] =
  useState<"correct" | "incorrect" | null>(null);



  function checkAnswer(userAnswer:boolean){


    if(userAnswer === data.answer){

      setResult("correct");

    } else {

      setResult("incorrect");

    }


  }



return (

   <View style={styles.card}>


      {/* Voice button */}
      <TouchableOpacity

        style={styles.voiceButton}

        onPress={() =>
          speakText(data.question)
        }

      >

        <Text style={styles.voiceIcon}>
          🔊{data.question}
        </Text>


      </TouchableOpacity>


<View style={styles.buttons}>


<TouchableOpacity

style={styles.trueButton}

onPress={()=>checkAnswer(true)}

>

<Text style={styles.buttonText}>
TRUE
</Text>


</TouchableOpacity>




<TouchableOpacity

style={styles.falseButton}

onPress={()=>checkAnswer(false)}

>

<Text style={styles.buttonText}>
FALSE
</Text>


</TouchableOpacity>


</View>



{
result &&

<View style={styles.result}>


<Text style={styles.icon}>

{
result === "correct"
?
"✅"
:
"❌"
}

</Text>


<Text style={styles.resultText}>

{
result === "correct"
?
"Correct!"
:
"Incorrect"
}

</Text>


<Text style={styles.explanation}>

{data.explanation}

</Text>


</View>

}


</View>

);


}




const styles = StyleSheet.create({

card:{

backgroundColor:"white",

width:"90%",

padding:25,

borderRadius:20,

alignItems:"center",

elevation:5

},


question:{

fontSize:22,

textAlign:"center",

marginBottom:30

},


buttons:{

flexDirection:"row",

gap:20

},


trueButton:{

backgroundColor:"#4CAF50",

padding:15,

borderRadius:15,

width:120,

alignItems:"center"

},


falseButton:{

backgroundColor:"#F44336",

padding:15,

borderRadius:15,

width:120,

alignItems:"center"

},


buttonText:{

color:"white",

fontWeight:"bold",

fontSize:18

},


result:{

marginTop:30,

alignItems:"center"

},


icon:{

fontSize:70

},


resultText:{

fontSize:28,

fontWeight:"bold"

},


explanation:{

marginTop:15,

textAlign:"center"

},
  voiceButton: {
    marginBottom: 15,
    backgroundColor: "#E8F0FE",
    padding: 10,
    borderRadius: 50,
  },

  voiceIcon: {
    fontSize: 30,
  },


});