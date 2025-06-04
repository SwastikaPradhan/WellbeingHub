"use client";

import Image from "next/image";
import { useState } from "react";
import { databases, account,ID } from "@/lib/appwrite";

export default function ActivityLogForm() {
  const [activityType, setActivityType] = useState("");
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const databaseId= process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const collectionId= process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ACTIVITY!;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      const user = await account.get(); 

      await databases.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        {
          activityType,
          duration: Number(duration),
          intensity,
          notes,
           timestamp: new Date().toISOString()
        }
      );

      setSuccess("Activity saved successfully!");
      setActivityType("");
      setDuration("");
      setIntensity("");
      setNotes("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-yellow-100 text-black px-8 py-12 font-mono border-t-8 border-black">
      
      <div className="hidden md:flex justify-center items-center md:w-1/2">
        <Image
          src="/yogaimage.avif"
          alt="Funny Yoga"
          width={400}
          height={200}
          className="border-4 border-black shadow-lg p-2 bg-white"
        />
      </div>

      
      <div className="w-full md:w-1/2 max-w-xl border-4 border-black bg-white p-8 shadow-lg">
        <h2 className="text-4xl font-extrabold mb-6 uppercase border-b-4 border-black pb-2">
          Log Activity
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-lg font-bold mb-1 uppercase">
              Activity Type
            </label>
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              className="w-full border-4 border-black px-4 py-2 bg-yellow-50 focus:outline-none"
            >
              <option>Select Activity</option>
              <option>Yoga</option>
              <option>Running</option>
              <option>Gym</option>
            </select>
          </div>

          <div>
            <label className="block text-lg font-bold mb-1 uppercase">
              Duration (minutes)
            </label>
            <input
              type="number"
              placeholder="Like 30..."
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full border-4 border-black px-4 py-2 bg-yellow-50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-lg font-bold mb-1 uppercase">
              Intensity
            </label>
            <select
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
              className="w-full border-4 border-black px-4 py-2 bg-yellow-50 focus:outline-none"
            >
              <option>Select Intensity</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div>
            <label className="block text-lg font-bold mb-1 uppercase">
              Notes
            </label>
            <textarea
              rows={3}
              placeholder="How was your vibe?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border-4 border-black px-4 py-2 bg-yellow-50 focus:outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white text-lg font-bold py-3 border-4 border-black hover:bg-white hover:text-black transition-all uppercase"
          >
            Save Activity 🚀
          </button>

          {success && <p className="text-green-600">{success}</p>}
          {error && <p className="text-red-600">{error}</p>}
        </form>
      </div>
    </main>
  );
}


