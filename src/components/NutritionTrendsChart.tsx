'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { databases } from '@/lib/appwrite';
import { parseISO, format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Select,SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, } from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_NUTRITION!;

type NutritionPoint = {
  day: string;
  kcal: number;
  protein: number;
  carbs: number;
};

export default function NutritionTrendsChart() {
  const [data, setData] = useState<NutritionPoint[]>([]);
  const [view, setView] = useState<'week' | 'month'>('week');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  useEffect(() => {
    async function fetchNutritionData() {
      try {
        const res = await databases.listDocuments(databaseId, collectionId);

        const now = new Date();
        const rangeStart = view === 'week' ? startOfWeek(now, { weekStartsOn: 1 }) : startOfMonth(now);
        const rangeEnd = view === 'week' ? endOfWeek(now, { weekStartsOn: 1 }) : endOfMonth(now);

        const dayMap: Record<string, NutritionPoint> = {};

        for (let d = new Date(rangeStart); d <= rangeEnd; d.setDate(d.getDate() + 1)) {
          const key = format(new Date(d), 'MMM d');
          dayMap[key] = { day: key, kcal: 0, protein: 0, carbs: 0 };
        }

        res.documents.forEach((doc) => {
          if (!doc.date) return;

          const dateObj = parseISO(doc.date);
          if (dateObj < rangeStart || dateObj > rangeEnd) return;

          const key = format(dateObj, 'MMM d');
          if (!dayMap[key]) {
            dayMap[key] = { day: key, kcal: 0, protein: 0, carbs: 0 };
          }

          dayMap[key].kcal += doc.totalKcal || 0;
          dayMap[key].protein += doc.protein || 0;
          dayMap[key].carbs += doc.carbs || 0;
        });

        setData(Object.values(dayMap));
      } catch (error) {
        console.error('Error fetching nutrition data:', error);
      }
    }

    fetchNutritionData();
  }, [view]);

  return (
    <Card className="p-6 rounded-2xl shadow hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-semibold text-sm text-gray-500">Nutrition Trends</h3>
          <h2 className="text-2xl font-bold text-gray-900">Calorie & Macro Intake</h2>
          <p className="text-sm text-gray-500">Daily Totals ({view === 'week' ? 'This Week' : 'This Month'})</p>
        </div>
        <div className="flex gap-4 items-center">
         <Select value={view} onValueChange={(val) => setView(val as 'week' | 'month')}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select view" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="week">Week</SelectItem>
    <SelectItem value="month">Month</SelectItem>
  </SelectContent>
</Select>


          <Toggle pressed={chartType === 'bar'} onPressedChange={() => setChartType(chartType === 'bar' ? 'line' : 'bar')}>
            {chartType === 'bar' ? 'Bar' : 'Line'} Chart
          </Toggle>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="kcal" stroke="#10b981" strokeWidth={3} dot={false} name="Calories" />
            <Line type="monotone" dataKey="protein" stroke="#6366f1" strokeWidth={2} dot={false} name="Protein (g)" />
            <Line type="monotone" dataKey="carbs" stroke="#f59e0b" strokeWidth={2} dot={false} name="Carbs (g)" />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="kcal" fill="#10b981" name="Calories" />
            <Bar dataKey="protein" fill="#6366f1" name="Protein (g)" />
            <Bar dataKey="carbs" fill="#f59e0b" name="Carbs (g)" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </Card>
  );
}
