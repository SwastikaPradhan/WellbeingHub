'use client';
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { databases } from "@/lib/appwrite";
import { parseISO, isWithinInterval, subDays } from "date-fns";

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_JOURNAL!;

export default function HistoricalComparison() {
  const [thisWeekAvg, setThisWeekAvg] = useState<number | null>(null);
  const [lastWeekAvg, setLastWeekAvg] = useState<number | null>(null);
  const [change, setChange] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await databases.listDocuments(databaseId, collectionId);
        const today = new Date();
        const startThisWeek = subDays(today, 6);
        const startLastWeek = subDays(today, 13);
        const endLastWeek = subDays(today, 7);

        const thisWeekMoods: number[] = [];
        const lastWeekMoods: number[] = [];

        res.documents.forEach((doc) => {
          if (!doc.date || typeof doc.mood !== 'number') return;

          const date = parseISO(doc.date);

          if (isWithinInterval(date, { start: startThisWeek, end: today })) {
            thisWeekMoods.push(doc.mood);
          } else if (isWithinInterval(date, { start: startLastWeek, end: endLastWeek })) {
            lastWeekMoods.push(doc.mood);
          }
        });

        const avg = (arr: number[]) =>
          arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

        const thisAvg = avg(thisWeekMoods);
        const lastAvg = avg(lastWeekMoods);
        const percentChange = lastAvg
          ? parseFloat(((thisAvg - lastAvg) / lastAvg * 100).toFixed(1))
          : 100;

        setThisWeekAvg(thisAvg);
        setLastWeekAvg(lastAvg);
        setChange(percentChange);
      } catch (err) {
        console.error("Error fetching historical comparison:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="p-6 rounded-2xl shadow hover:shadow-lg transition-all duration-300 min-h-[250px]">
      <h3 className="font-semibold text-sm text-gray-500">Historical Comparison</h3>
      {thisWeekAvg !== null && lastWeekAvg !== null && change !== null ? (
        <div className="mt-4 space-y-2">
          <p className="text-xl text-gray-800">
            This Week Avg Mood: <span className="font-bold">{thisWeekAvg}</span>
          </p>
          <p className="text-xl text-gray-800">
            Last Week Avg Mood: <span className="font-bold">{lastWeekAvg}</span>
          </p>
          <p className={`text-xl ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            Change: {change >= 0 ? '+' : ''}
            {change}%
          </p>
        </div>
      ) : (
        <p className="text-gray-400 mt-4">Loading data...</p>
      )}
    </Card>
  );
}

