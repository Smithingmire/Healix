const router = require("express").Router();
const aiService = require("../services/aiService");


// browser test
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Chat route working"
  });
});


// Main chat endpoint - handles conversational AI
router.post("/", async (req, res) => {
  try {
    const { message, history, language } = req.body;
    const targetLanguage = language || "English";

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "Message is required"
      });
    }

    // Build conversation context from history
    const conversationContext = (history || [])
      .map(msg => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n");

    const prompt = conversationContext
      ? `Previous conversation:\n${conversationContext}\n\nUser: ${message}\n\nRespond helpfully as a health assistant.`
      : message;

    const aiResponse = await aiService.askAI(prompt, targetLanguage);

    let concept = null;
    if (!history || history.length === 0) {
      try {
        const conceptPrompt = `Identify the main medical or general topic/concept of the following user query in 2 to 3 words. Return ONLY the 2-3 words, no punctuation or extra text. Respond ONLY in ${targetLanguage}. User query: "${message}"`;
        const conceptResponse = await aiService.askAI(conceptPrompt, targetLanguage);
        concept = conceptResponse.trim().replace(/[".']/g, "");
      } catch (err) {
        console.error("Failed to extract concept:", err.message);
      }
    }

    res.json({
      success: true,
      text: aiResponse,
      concept: concept
    });

  } catch (error) {
    console.error("Chat Error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process chat message"
    });
  }
});


module.exports = router;
