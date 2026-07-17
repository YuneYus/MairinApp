import { StyleSheet } from "react-native";

/*
import { clearAllMeals, getMeals, Meal } from "../../storage/calendarStorage";
import MealItem from "../components/mealitem";
*/

export default function MealScreen() {
  /*
     const [meals, setMeals] = useState<Meal[]>([]);

  const loadMeals = async () => {
    const data = await getMeals();
    setMeals(data);
  };

    const handleClearAll = async () => {
    await clearAllMeals();
    loadMeals();
  };

  useFocusEffect(
    useCallback(() => {
      loadMeals();
    }, []),
  );

    return(
        <ScrollView style= {globalStyles.container}>
            <View style={globalStyles.header}>
            <Text style={globalStyles.title}>All Meals</Text>
          <TouchableOpacity style={styles.Button} onPress={handleClearAll}>
          <Text style={styles.ButtonText}>Clear All</Text>
        </TouchableOpacity>
            </View>

             <View style={{ marginTop: 30 }}>
        {meals.length === 0 ? (
          <Text style={globalStyles.empty}>No meals logged yet.</Text>
        ) : (
          meals.map((meal) => (
            <MealItem
              key={meal.id}
              id={meal.id}
              name={meal.name}
              calories={meal.calories}
              protein={meal.protein}
              carbs={meal.carbs}
              fat={meal.fat}
              onDelete={loadMeals}
            />
          ))
        )}
      </View>
        </ScrollView>
       
    ); */
}

const styles = StyleSheet.create( {
  
  ButtonText: {
    color: 'red',
    fontSize: 16,
  },
  Button: {
    backgroundColor: "yellow",
    padding: 12,
    borderRadius: 8,
    alignItems: "flex-end",
    marginTop: 10,

  },
});

