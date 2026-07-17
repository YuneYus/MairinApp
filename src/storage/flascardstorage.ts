import AsyncStorage from "@react-native-async-storage/async-storage";


const KEY="completedFlashcard";


export async function saveCompletion(){

const today =
new Date()
.toISOString()
.split("T")[0];


await AsyncStorage.setItem(
KEY,
today
);

}



export async function hasCompletedToday(){

const saved =
await AsyncStorage.getItem(KEY);


const today =
new Date()
.toISOString()
.split("T")[0];


return saved===today;

}