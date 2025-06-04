"use client";

import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { databases, account, ID } from "@/lib/appwrite";

export default function NutritionLog() {
  const [date, setDate] = useState(new Date());
  const [meals, setMeals] = useState([
    { name: 'Breakfast', kcal: 0 },
    { name: 'Lunch', kcal: 0 },
    { name: 'Dinner', kcal: 0 },
    { name: 'Snacks', kcal: 0 },
  ]);
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_NUTRITION!;

  const handleSave = async () => {
    try {
      const session = await account.get();
      const userId = session.$id;

      const docPayload = {
        date: date.toISOString(),
        userId,
        breakfast: meals.find(m => m.name === 'Breakfast')?.kcal || 0,
        lunch: meals.find(m => m.name === 'Lunch')?.kcal || 0,
        dinner: meals.find(m => m.name === 'Dinner')?.kcal || 0,
        snacks: meals.find(m => m.name === 'Snacks')?.kcal || 0,
        totalKcal,
        protein,
        carbs,
      };

      await databases.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        docPayload
      );

      alert('Nutrition log saved!');
    } catch (err) {
      console.error(err);
      alert('Failed to save nutrition log.');
    }
  };

  const calorieGoal = 2500;

  const handleAdd = (mealName: string) => {
    const input = prompt(`Enter calories for ${mealName}`);
    const kcal = parseInt(input || '0');
    if (isNaN(kcal)) return alert('Please enter a valid number');

    setMeals((prev) =>
      prev.map((meal) =>
        meal.name === mealName ? { ...meal, kcal: kcal } : meal
      )
    );
  };

  const totalKcal = meals.reduce((sum, meal) => sum + meal.kcal, 0);
  const protein = Math.round(totalKcal * 0.2 / 4);
  const carbs = Math.round(totalKcal * 0.5 / 4);
  const progress = Math.min(100, (totalKcal / calorieGoal) * 100);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-6 py-12">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-2">Nutrition Log</h1>
        <p className="text-sm text-gray-600 mb-8">
          Track your daily food intake and nutritional information.
        </p>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Calendar Section */}
          <div className="w-full md:w-1/3">
            <Calendar
              onChange={(val) => val instanceof Date && setDate(val)}
              value={date}
            />
          </div>

          {/* Meals + Summary */}
          <div className="w-full md:w-2/3">
            {/* Meals */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Today's Meals</h2>
              {meals.map((meal) => (
                <div key={meal.name} className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium">{meal.name}</p>
                    <p className="text-sm text-gray-500">{meal.kcal} kcal</p>
                  </div>
                  <button
                    onClick={() => handleAdd(meal.name)}
                    className="bg-gray-100 px-4 py-1 rounded hover:bg-gray-200"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Nutritional Summary</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600">Total Calories</p>
                  <p className="font-bold text-xl">{totalKcal} kcal</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600">Protein</p>
                  <p className="font-bold text-xl">{protein}g</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600">Carbs</p>
                  <p className="font-bold text-xl">{carbs}g</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="text-sm text-gray-500 mb-1">Calorie Goal</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {totalKcal} / {calorieGoal} kcal ({Math.round(progress)}%)
              </p>
            </div>

            <button
              onClick={handleSave}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save Nutrition Log
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}


