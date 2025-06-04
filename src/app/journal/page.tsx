"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { databases, account, ID } from "@/lib/appwrite";

export default function DailyJournal() {
  const [date, setDate] = useState<Date | null>(new Date());
  const [entry, setEntry] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [userId, setUserId] = useState("");

  const moods = ["Happy", "Content", "Neutral", "Sad", "Anxious"];
  const topics = ["Relationships", "Work", "Health", "Hobbies", "Personal Growth"];

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_JOURNAL!;

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await account.get();
        setUserId(user.$id);
      } catch (err) {
        console.error("Not logged in!");
      }
    };
    getUser();
  }, []);

  const handleSave = async () => {
    if (!entry || !date || !selectedMood || selectedTopics.length === 0) {
      alert("Don't be lazy! Fill out all the fields 😛");
      return;
    }

    const payload = {
      date: date.toISOString(),
      mood: selectedMood,
      topics: selectedTopics.join(", "),
      entry,
      userid: userId,
    };

    try {
      await databases.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        payload
      );
      alert("Your genius thoughts are now safely stored 🚀");
      setEntry("");
      setSelectedMood("");
      setSelectedTopics([]);
    } catch (error) {
      console.error("Error saving journal:", error);
      alert("Oops! Your feelings got lost in the matrix 😵‍💫");
    }
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  return (
    <div className="min-h-screen bg-white text-black px-6 pt-24 flex justify-center">
      <div className="flex w-full max-w-6xl gap-10">
        <div className="w-72 flex flex-col gap-6">
          {/* Calendar */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Today</h2>
            <Calendar
              onChange={(value) => {
                if (value instanceof Date) setDate(value);
                else setDate(null);
              }}
              value={date}
              className="rounded-lg border border-gray-300 shadow"
            />
          </div>

          {/* Mood */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Mood</h2>
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`px-3 py-1 border rounded-full ${
                    selectedMood === mood ? "bg-green-200 font-bold" : ""
                  } hover:bg-gray-200`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Topics</h2>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`px-3 py-1 border rounded-full text-sm ${
                    selectedTopics.includes(topic)
                      ? "bg-yellow-200 font-bold"
                      : "bg-gray-100"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Journal Entry */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-6">
            Daily Journal <span className="text-green-500">📝</span>
          </h1>
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="Spill the tea about your day... ☕"
            rows={12}
            className="w-full p-4 border border-gray-300 rounded-lg shadow mb-6 resize-none"
          ></textarea>

          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition"
          >
            Save Entry ✨
          </button>
        </div>
      </div>
    </div>
  );
}

