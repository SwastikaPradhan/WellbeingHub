import { Card } from "@/components/ui/card";
import NutritionTrendsChart from "./NutritionTrendsChart";

export default function NutritionSection() {
  return (
    <div className="space-y-12">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">🍽️ Nutrition Overview</h2>
        <p className="text-gray-600 mt-2 text-lg">
          Understand your daily intake and stay on top of your health goals.
        </p>
      </div>
      <NutritionTrendsChart/>

     
      
    </div>
  );
}
