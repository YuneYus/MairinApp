import { globalStyles } from '@/styles/global';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { router } from "expo-router";
import { useState } from "react";
//import { addMeal } from '../../storage/calendarStorage';

//to make haptic sound when is added
import * as Haptics from "expo-haptics";


//trying github
export default function AddMealScreen() {
  
  const [name, setName] = useState("")
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  
  const handleAddMeal= async() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    if (!name || !calories ) {
      Alert.alert("Error", "please enter a meal name and calories")
      return;
    }

//if is not a number then its going to show an alert
     if (
    isNaN(Number(calories)) ||
    isNaN(Number(protein)) ||
    isNaN(Number(carbs)) ||
    isNaN(Number(fat))
  ) {
    Alert.alert(
      "Invalid Input",
      "Calories, protein, carbs, and fat must be numbers."
    );
    return;
  }

     /* await addMeal({
      name,
      calories: Number(calories),
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
       });
    //console.log({name, calories, protein, carbs, fat});

     // 👇 Check AsyncStorage here
     //way 2 of printing the data in log
  const data = await AsyncStorage.getItem("meals");
  console.log(data);
*/

      //clear everything up
  setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');

    Alert.alert('Success', 'Meal added successfully!');

    router.push('/'); //redirect to the same place
  };


  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Add Meal</Text>

    <TextInput 
    style= {styles.input}
    placeholder='Meal name...'
    placeholderTextColor={"white"}
    value ={name}
    onChangeText={setName}
    />

      <View style={styles.row}>
        <TextInput 
        style= {[styles.input, styles.flex]}
        keyboardType='numeric'
        placeholder='calories...'
        placeholderTextColor={"white"}
        value ={calories}
        onChangeText={setCalories}
        />

          <TextInput 
         style= {[styles.input, styles.flex]}
        placeholder='protein...'
        placeholderTextColor={"white"}
        value ={protein}
        keyboardType='numeric'
        onChangeText={setProtein}
        />

         <TextInput 
         style= {[styles.input, styles.flex]}
        placeholder='carbs(g)...'
        placeholderTextColor={"white"}
        value ={carbs}
        keyboardType='numeric'
        onChangeText={setCarbs}
        />

        <TextInput 
         style= {[styles.input, styles.flex]}
        placeholder='Fat(g)...'
        placeholderTextColor={"white"}
        value ={fat}
        keyboardType='numeric'
        onChangeText={setFat}
        />

    </View>

      <TouchableOpacity style = {styles.button} onPress={handleAddMeal}>
      <Text style={styles.buttonText}>Add meal</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "blue",
    color: "yellow",
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    marginTop: 16,
    flexWrap: 'wrap',
    
  },
  row: {
    flexDirection: "row",
    gap: 15,
  },
  flex: {
    flex: 1,
    color:"yellow",
    padding: 16,
  },
  button: {
    backgroundColor: "pink",
    padding:16,
    borderRadius:5,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: globalStyles.title.fontFamily
  }
})