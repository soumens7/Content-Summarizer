/**
 * @jest-environment node
 */
import { POST } from "../app/api/summarize/route";
import axios from "axios";

describe("POST /api/summarize/route", () => {
  beforeEach(() => {
    axios.post.mockReset();
    process.env.HUGGINGFACE_API_KEY = "test-key";
  });
  // handle console.error calls in tests
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  it("should return 400 if text is missing", async () => {
    const req = new Request("http://localhost/api/summarize/route", {
      method: "POST",
      body: JSON.stringify({}), // no text
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Text is required");
  });

  it("should return 200 and summary when Hugging Face succeeds", async () => {
    axios.post.mockResolvedValueOnce({
      data: [{ summary_text: "This is a summary" }],
    });

    const req = new Request("http://localhost/api/summarize/route", {
      method: "POST",
      body: JSON.stringify({ text: "Long input text..." }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.result).toBe("This is a summary");

    // Verify axios called with expected Hugging Face URL
    expect(axios.post).toHaveBeenCalledWith(
      "https://router.huggingface.co/hf-inference/models/sshleifer/distilbart-cnn-12-6",
      { inputs: expect.stringContaining("Long input text...") },
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-key",
        }),
      })
    );
  });

  it("should return 500 if Hugging Face API throws error", async () => {
    axios.post.mockRejectedValueOnce(new Error("API down"));

    const req = new Request("http://localhost/api/summarize/route", {
      method: "POST",
      body: JSON.stringify({ text: "Some text" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("Failed to summarize");
  });
});
