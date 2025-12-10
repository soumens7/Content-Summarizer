import axios from "axios";

let lastCall = 0;
const COOLDOWN = 1500;
const PRIMARY_MODEL =
  "https://router.huggingface.co/hf-inference/models/sshleifer/distilbart-cnn-12-6";
const FALLBACK_MODEL =
  "https://router.huggingface.co/hf-inference/models/google/pegasus-xsum";

const isTest = process.env.NODE_ENV === "test";

export async function POST(req) {
  const now = Date.now();

  if (!isTest && now - lastCall < COOLDOWN) {
    return new Response(
      JSON.stringify({ error: "Please wait before making another request." }),
      { status: 429 }
    );
  }

  lastCall = now;

  const { text } = await req.json();

  if (!text || text.trim() === "") {
    return new Response(JSON.stringify({ error: "Text is required" }), {
      status: 400,
    });
  }

  try {
    // --- Primary call ---
    const response = await axios.post(
      PRIMARY_MODEL,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const summary = response.data?.[0]?.summary_text || "No summary returned.";

    return new Response(JSON.stringify({ result: summary }), {
      status: 200,
    });
  } catch (err) {
    if (isTest) {
      console.error("Summarization error (test):", err.message);
      return new Response(JSON.stringify({ error: "Failed to summarize" }), {
        status: 500,
      });
    }

    // --- Fallback only in non-test env ---
    try {
      const fallback = await axios.post(
        FALLBACK_MODEL,
        { inputs: text },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const summary =
        fallback.data?.[0]?.summary_text || "No summary returned.";

      return new Response(JSON.stringify({ result: summary }), {
        status: 200,
      });
    } catch (fallbackErr) {
      console.error(
        "Summarization error (fallback):",
        fallbackErr.response?.data || fallbackErr.message
      );
      return new Response(JSON.stringify({ error: "Failed to summarize" }), {
        status: 500,
      });
    }
  }
}
