
import { flashcards } from "../data/flashcards";

export function getDailyFlashcard(){

 const today =
 new Date()
 .toISOString()
 .split("T")[0];


 const dayNumber =
 Math.floor(
 new Date(today).getTime()
 /
 (1000*60*60*24)
 );


 const index =
 dayNumber % flashcards.length;


 return flashcards[index];

}