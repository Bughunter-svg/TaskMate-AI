// routes/ai.js
require('dotenv').config();
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.post('/chat', async (req, res) => {
  try {
    const { username, message } = req.body;
    if (!message) return res.status(400).json({ success: false, error: "Message is required!" });

    const API_KEY = process.env.GEMINI_API_KEY;
    const MODEL = "gemini-2.5-flash";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: message }] }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Gemini API Error:", data);
      return res.status(500).json({ success: false, error: data.error?.message || "Gemini request failed" });
    }

    const aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini.";

    res.json({
      success: true,
      user: username || "Anonymous",
      reply: aiText,
    });

  } catch (err) {
    console.error("🔥 AI Chat Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

// add in routes/ai.js
router.get('/test', async (req, res) => {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash?key=${API_KEY}`
    );
    const data = await response.json();
    res.json({
      success: true,
      model: data.name || "Unknown",
      status: "✅ Gemini API working fine"
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// routes/ai.js (below chat route)
router.get('/summary', async (req, res) => {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ text: "Summarize today’s team progress in a fun, motivating way." }]
          }]
        })
      }
    );
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary generated.";
    res.json({ success: true, summary: text });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
