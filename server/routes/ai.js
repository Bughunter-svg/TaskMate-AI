const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 🔐 Initialize Gemini
const genAI = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// 🧠 Chat endpoint
router.post("/chat", async (req, res) => {
  try {
    const { username, message } = req.body;
    if (!message)
      return res.status(400).json({ success: false, error: "Message is required." });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    You are TaskMate AI, a friendly productivity assistant for developers.
    The user’s name is ${username}.
    Message: ${message}
    Respond briefly but positively, encouraging productivity or answering questions.
    `;

    const result = await model.generateContent(prompt);

    res.json({
      success: true,
      reply: result.response.text(),
    });
  } catch (err) {
    console.error("🔥 Gemini Chat Error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Something went wrong with the AI request.",
    });
  }
});

// 📅 Daily summary endpoint
router.get("/summary", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Summarize today's productivity for all team members in a motivational tone.
    Mention common achievements, teamwork, and what could improve tomorrow.
    `;

    const result = await model.generateContent(prompt);

    res.json({
      success: true,
      summary: result.response.text(),
    });
  } catch (err) {
    console.error("🔥 Gemini Summary Error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Error generating summary.",
    });
  }
});

module.exports = router;
