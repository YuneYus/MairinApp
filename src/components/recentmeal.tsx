import { globalStyles } from '@/styles/global';
import { ScrollView, Text } from 'react-native';
import MealItem from './mealitem';

import { Meal } from '../storage/calendarStorage';

type RecentMealsProps = {
  meals: Meal[];
  onDelete:()=> void;
};


export default function RecentMeals({ meals, onDelete }: RecentMealsProps) {
  return (

    <ScrollView style={{ marginTop: 30 }}>
      <Text style={globalStyles.sectionTitle}>Recent Meals</Text>
      {meals.length === 0 ? (
        <Text style={globalStyles.empty}>No meals logged yet.</Text>
      ) : (
        meals
          .slice(0, 5)
          .map((meal) => (
            <MealItem
              id={meal.id}
              key={meal.id}
              name={meal.name}
              calories={meal.calories}
              protein={meal.protein}
              carbs={meal.carbs}
              fat={meal.fat}
              onDelete={onDelete}
            />
          ))
      )}
    </ScrollView>

    /* this is having three containers in the home 
    <ScrollView style={{ marginTop: 30 }}>
      <Text style={globalStyles.sectionTitle}>Recent Meals</Text>
      <MealItem
        name='Chicken & Rice'
        calories={540}
        protein={45}
        carbs={50}
        fat={12}
      />
      <MealItem
        name='Protein Shake'
        calories={280}
        protein={30}
        carbs={20}
        fat={8}
      />
      <MealItem
        name='Salmon Salad'
        calories={430}
        protein={35}
        carbs={10}
        fat={25}
      />
    </ScrollView> */
  ); 
}
