import axios from "axios";

export async function POST(req) {
  // Read the body of the request
  const { text } = await req.json();

  // Ensure that text is provided
  if (!text || text.trim() === "") {
    return new Response(
      JSON.stringify({ error: "Text is required" }),
      { status: 400 }
    );
  }

  try {
    // Call the Hugging Face API for text summarization
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn", // Hugging Face model URL
      {
        inputs: `Summarize this: ${text}`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`, // Your Hugging Face API key
          "Content-Type": "application/json",
        },
      }
    );

    const summary = response.data[0]?.summary_text || "No summary returned.";
    
    // Return the summary as JSON
    return new Response(
      JSON.stringify({ result: summary }),
      { status: 200 }
    );
  } catch (err) {
    // Handle any errors during the summarization process
    console.error("Summarization error:", err.response?.data || err.message);
    return new Response(
      JSON.stringify({ error: "Failed to summarize" }),
      { status: 500 }
    );
  }
}
