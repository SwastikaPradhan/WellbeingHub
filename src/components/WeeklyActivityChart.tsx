'use client';

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useEffect, useState } from 'react';
import { databases } from '@/lib/appwrite'; 
import { parseISO, format, isWithinInterval, subDays } from 'date-fns';

 const databaseId= process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const collectionId= process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ACTIVITY!;


export default function ActivityChart() {
  type WeeklyData = {
  name: string;
  hours: number;
};
  const [data, setData] = useState<WeeklyData[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [percentageChange, setPercentageChange] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      const res = await databases.listDocuments(databaseId, collectionId);

      const today = new Date();
      const startOfThisWeek = subDays(today, 6);
      const startOfLastWeek = subDays(today, 13);
      const endOfLastWeek = subDays(today, 7);

      const currentWeekData: { [key: string]: number } = {
        Mon: 0,
        Tue: 0,
        Wed: 0,
        Thu: 0,
        Fri: 0,
        Sat: 0,
        Sun: 0,
      };

      let thisWeekTotal = 0;
      let lastWeekTotal = 0;

      res.documents.forEach((doc) => {
        if (!doc.timestamp || !doc.duration) return;

        const date = parseISO(doc.timestamp);
        const day = format(date, 'EEE');

        const hours = doc.duration / 60;

        if (isWithinInterval(date, { start: startOfThisWeek, end: today })) {
          currentWeekData[day] += hours;
          thisWeekTotal += hours;
        } else if (
          isWithinInterval(date, { start: startOfLastWeek, end: endOfLastWeek })
        ) {
          lastWeekTotal += hours;
        }
      });

      const weeklyData = Object.entries(currentWeekData).map(
        ([name, hours]) => ({
          name,
          hours: parseFloat(hours.toFixed(1)),
        })
      );

      setData(weeklyData);
      setTotalHours(parseFloat(thisWeekTotal.toFixed(1)));

      const change = lastWeekTotal
  ? (((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100).toFixed(1)
  : '100.0'; 

setPercentageChange(parseFloat(change));
    }

    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 border rounded-md shadow-sm">
      <h2 className="text-xl font-semibold mb-1">Weekly Activity Summary</h2>
      <p className="text-3xl font-bold">{totalHours} hours</p>
      <p className={`mb-4 ${percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        Last 7 Days {percentageChange >= 0 ? '+' : ''}
        {percentageChange}%
      </p>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, bottom: 20, left: 10 }}
        >
          <XAxis dataKey="name" padding={{ left: 10, right: 10 }} />
          <Tooltip />
          <Bar dataKey="hours" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

