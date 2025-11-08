const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Hey Gemini, give me a quick motivational quote!");
    console.log("✅ Response:\n", result.response.text());
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

testGemini();
