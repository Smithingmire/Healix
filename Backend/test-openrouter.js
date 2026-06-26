require("dotenv").config();

const axios = require("axios");

async function testAI() {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemma-3-27b-it:free",
        messages: [
          {
            role: "user",
            content: "Say Hello"
          }
        ],
        max_tokens: 100
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("AI RESPONSE:");
    console.log(
      response.data.choices[0].message.content
    );

  } catch (error) {
    console.log("ERROR:");

    console.log(
      error.response?.data ||
      error.message
    );
  }
}

testAI();