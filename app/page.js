"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const MAX_CHAR_LIMIT = 1000;

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

  const handleClear = () => {
    setText("");
    setSummary("");
    setError("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 px-4 py-8 items-center">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">
          🧠 Content Summarizer
        </h1>
        <p className="text-gray-600 text-sm">
          Paste your content below and get a concise summary instantly.
        </p>
      </header>

      {/* Input Area */}
      <div className="w-full max-w-2xl mb-4 relative">
        <textarea
          className="w-full bg-white shadow rounded-lg p-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows="10"
          maxLength={MAX_CHAR_LIMIT}
          placeholder="Paste the content to summarize..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
        ></textarea>
        <div className="absolute bottom-2 right-4 text-xs text-gray-500">
          {text.length}/{MAX_CHAR_LIMIT} characters
        </div>
      </div>

      {/* Button Group */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleSummarize}
          disabled={isLoading || !text.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isLoading ? "Summarizing..." : "Summarize"}
        </button>

        <button
          onClick={handleClear}
          disabled={!text && !summary}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition disabled:opacity-30"
        >
          Clear
        </button>
      </div>

      {/* Error Display */}
      {error && <p className="text-red-500 mb-4 font-medium">{error}</p>}

      {/* Summary Output */}
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">
          📝 Summary:
        </h2>
        <p className="text-gray-800 whitespace-pre-wrap">
          {summary || "Summary will appear here after submission."}
        </p>
      </div>
    </div>
  );
}
