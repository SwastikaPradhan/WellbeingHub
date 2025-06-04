'use client';

import { useState ,useEffect} from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WeeklyActivityChart from "@/components/WeeklyActivityChart";
import MonthlyStepsChart from "@/components/StepsChart";
import NutritionSection from "@/components/Nutrition";
import JournalSection from "@/components/Journal";
import AuthGuard from "@/components/AuthGuard";
import { Models } from 'appwrite';
import { getActivityData, getNutritionData, getJournalData } from '@/lib/fetchData';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'activities' | 'nutrition' | 'journal'>('activities');

  
const [activity, setActivity] = useState<Models.Document[]>([]);
const [nutrition, setNutrition] = useState<Models.Document[]>([]);
const [journal, setJournal] = useState<Models.Document[]>([]);
  useEffect(() => {
    async function fetchData() {
      if (activeTab === 'activities') {
        const data = await getActivityData();
        setActivity(data);
      } else if (activeTab === 'nutrition') {
        const data = await getNutritionData();
        setNutrition(data);
      } else if (activeTab === 'journal') {
        const data = await getJournalData();
        setJournal(data);
      }
    }

    fetchData();
  }, [activeTab]);

  return (
     <AuthGuard>
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex justify-center items-start p-6 md:p-10">
      <div className="w-full max-w-6xl space-y-12">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900">🎉 Your Progress</h1>
          <p className="text-gray-600 mt-2 text-lg">
            Track your wellness journey and celebrate your wins every step of the way.
          </p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex justify-center space-x-6 border-b pb-4">
          <Button
            variant="ghost"
            className={`text-lg ${activeTab === 'activities' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'}`}
            onClick={() => setActiveTab('activities')}
          >
            🏃‍♂️ Activities
          </Button>
          <Button
            variant="ghost"
            className={`text-lg ${activeTab === 'nutrition' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'}`}
            onClick={() => setActiveTab('nutrition')}
          >
            🥗 Nutrition
          </Button>
          <Button
            variant="ghost"
            className={`text-lg ${activeTab === 'journal' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'}`}
            onClick={() => setActiveTab('journal')}
          >
            📔 Journal
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === 'activities' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <WeeklyActivityChart />
              <MonthlyStepsChart />
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">🎯 Your Goals</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="flex items-center space-x-4 bg-green-100 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                  <span className="text-green-700 text-3xl">✅</span>
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">Fitness Goal</p>
                    <p className="text-sm text-gray-600">Complete 5 workouts this week</p>
                  </div>
                </Card>

                <Card className="flex items-center space-x-4 bg-yellow-100 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                  <span className="text-yellow-600 text-3xl">🍎</span>
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">Nutrition Goal</p>
                    <p className="text-sm text-gray-600">Maintain a balanced diet</p>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}

        {activeTab === 'nutrition' && <NutritionSection />}
        {activeTab === 'journal' && <JournalSection />}
      </div>
    </div>
    </AuthGuard>
  );
}




