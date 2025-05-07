"use client";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState(""); // Store input text
  const [summary, setSummary] = useState(""); // Store the summarized text
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleSummarize = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
      setSummary(data.result); // Set the summarized result
    } catch (error) {
      console.error("Error summarizing:", error);
      setSummary("Failed to summarize. Please try again later.");
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
      ></textarea>

      <button
        onClick={handleSummarize}
        disabled={isLoading}
        className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {isLoading ? "Summarizing..." : "Summarize Content"}
      </button>

      <div className="mt-6 w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-medium text-gray-700 mb-4">Summary:</h2>
        <p className="text-lg text-gray-800">
          {summary || "Summary will appear here"}
        </p>
      </div>
    </div>
  );
}
