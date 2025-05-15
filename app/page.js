"use client"
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [text, setText] = useState(""); 
  const [summary, setSummary] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); 

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError("Please enter some text to summarize.");
      return;
    }

    setIsLoading(true);
    setSummary("");
    setError("");

    try {
      const response = await axios.post("/api/summarize", { text });
      setSummary(response.data.result || "No summary returned.");
    } catch (error) {
      console.error("Summarization failed:", error);
      setError("Failed to summarize. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-semibold text-blue-600 mb-6">
        Content Summarizer
      </h1>

      <textarea
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg mb-4"
        placeholder="Paste the content to summarize..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="10"
        disabled={isLoading}
      ></textarea>

      <button
        onClick={handleSummarize}
        disabled={isLoading || !text.trim()}
        className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isLoading ? (
          <span className="animate-spin">🔄</span> // Simple spinner
        ) : (
          "Summarize Content"
        )}
      </button>

      {error && <p className="text-red-500 mt-4 font-medium">{error}</p>}

      <div className="mt-6 w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-medium text-gray-700 mb-4">Summary:</h2>
        <p className="text-lg text-gray-800">
          {summary || "Summary will appear here"}
        </p>
      </div>
    </div>
  );
}
