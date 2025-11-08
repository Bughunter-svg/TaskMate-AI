const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const { OpenAI } = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 🧠 Route: Generate a daily summary for all users
router.get('/summary', async (req, res) => {
  try {
    const activities = await Activity.find();

    // Format data for AI prompt
    const summaryData = activities.map(a => 
      `${a.username}: worked on "${a.currentTask}" (${a.fileName}), spent ${a.timeSpent} mins, currently ${a.online ? 'online' : 'offline'}`
    ).join('\n');

    const prompt = `
You are TaskMate AI, an assistant that summarizes team productivity.
Summarize today's activity in a friendly, motivating way:
${summaryData}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 250
    });

    res.json({
      success: true,
      summary: response.choices[0].message.content
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// 💬 Route: Chat with the AI about progress or advice
router.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ success: false, error: "Message required" });

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are TaskMate AI, a productivity assistant who helps teams work smart and stay positive." },
        { role: "user", content: message }
      ],
      max_tokens: 200
    });

    res.json({
      success: true,
      reply: response.choices[0].message.content
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
