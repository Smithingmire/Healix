require("dotenv").config();

const axios = require("axios");

async function testHF() {
  try {

    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: "Qwen/Qwen3-4B-Instruct-2507",

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
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log(
      response.data.choices[0].message.content
    );

  } catch (error) {

    console.log(
      error.response?.data ||
      error.message
    );

  }
}

testHF();