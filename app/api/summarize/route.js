import axios from "axios";
let lastCall = 0;
const COOLDOWN = 1500;
export async function POST(req) {
  const now = Date.now();
  if (now - lastCall < COOLDOWN) {
    return new Response(
      JSON.stringify({ error: "Please wait before making another request." }),
      { status: 429 }
    );
  }
  lastCall = now;
  // Read the body of the request
  const { text } = await req.json();

  // Ensure that text is provided
  if (!text || text.trim() === "") {
    return new Response(JSON.stringify({ error: "Text is required" }), {
      status: 400,
    });
  }
  try {
    try {
      // Call the Hugging Face API for text summarization
      const response = await axios.post(
        "https://router.huggingface.co/hf-inference/models/sshleifer/distilbart-cnn-12-6",
        {
          inputs: text,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const summary = response.data[0]?.summary_text || "No summary returned.";

      // Return the summary as JSON
      return new Response(JSON.stringify({ result: summary }), { status: 200 });
    } catch (err) {
      // fallback
      const fallback = await axios.post(
        "https://router.huggingface.co/hf-inference/models/google/pegasus-xsum",
        { inputs: text },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          },
        }
      );

      const summary = fallback.data[0]?.summary_text || "No summary returned.";
      return new Response(JSON.stringify({ result: summary }), { status: 200 });
    }
  } catch (ex) {
    return new Response(JSON.stringify({ error: "Failed to summarize" }), {
      status: 500,
    });
  }
}
