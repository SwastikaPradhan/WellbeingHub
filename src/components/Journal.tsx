'use client';

import { useEffect, useState } from "react";
import { databases } from "@/lib/appwrite";
import { ID, Models } from "appwrite";
import MoodTrendsChart from "./MoodTrendsChart";
import HistoricalComparison from "./HistoricalComparison";

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_JOURNAL!;

export default function JournalSection() {
  const [entries, setEntries] = useState<Models.Document[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedEntry, setEditedEntry] = useState("");

  // Fetch journal entries
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await databases.listDocuments(databaseId, collectionId);
        console.log("Fetched documents:", res.documents); 
        const sorted = res.documents.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setEntries(sorted);
      } catch (error) {
        console.error("Error fetching entries:", error);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (id: string, currentEntry: string) => {
    setEditingId(id);
    setEditedEntry(currentEntry);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await databases.updateDocument(databaseId, collectionId, id, {
        entry: editedEntry,
      });

      setEntries((prev) =>
        prev.map((doc) =>
          doc.$id === id ? { ...doc, entry: editedEntry } : doc
        )
      );
      setEditingId(null);
      setEditedEntry("");
    } catch (error) {
      console.error("Error updating entry:", error);
    }
  };

  return (
    <div className="space-y-12 px-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">📔 Journal Entries</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <MoodTrendsChart />
        <HistoricalComparison />
      </div>

      <div className="max-w-5xl mx-auto overflow-x-auto mt-10">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <tr>
              <th className="py-3 px-6 border-b">Date</th>
              <th className="py-3 px-6 border-b">Entry Summary</th>
              <th className="py-3 px-6 border-b text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {entries.map((entry) => (
              <tr
                key={entry.$id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-6 border-b">
                  {new Date(entry.date).toLocaleDateString()}
                </td>
                <td className="py-3 px-6 border-b">
                  {editingId === entry.$id ? (
                    <textarea
                      className="w-full border p-2 rounded"
                      value={editedEntry}
                      onChange={(e) => setEditedEntry(e.target.value)}
                    />
                  ) : (
                    entry.entry
                  )}
                </td>
                <td className="py-3 px-6 border-b text-center">
                  {editingId === entry.$id ? (
                    <button
                      onClick={() => handleSaveEdit(entry.$id)}
                      className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(entry.$id, entry.entry)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


