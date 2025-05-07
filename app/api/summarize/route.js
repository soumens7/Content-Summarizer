// app/api/summarize/route.js
import { OpenAI } from "openai";

export async function POST(req) {
  const { text } = await req.json();

  if (!text) {
    console.log("Error: No text provided");
    return new Response(JSON.stringify({ error: "Text is required" }), {
      status: 400,
    });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,  // Ensure API key is in the environment variables
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for summarizing content.",
        },
        {
          role: "user",
          content: `Summarize the following text: ${text}`,
        },
      ],
    });

    const summary = response.choices[0].message.content.trim();
    return new Response(JSON.stringify({ result: summary }), { status: 200 });
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    return new Response(
      JSON.stringify({ error: "Error with OpenAI API", details: error.message }),
      { status: 500 }
    );
  }
}
