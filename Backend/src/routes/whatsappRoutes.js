const router = require("express").Router();
const axios = require("axios");
const aiService = require("../services/aiService");
const whatsappService = require("../services/whatsappService");

// Get local WhatsApp bot connection status & QR code
router.get("/status", (req, res) => {
  const statusInfo = whatsappService.getWhatsAppStatus();
  return res.json({
    success: true,
    ...statusInfo
  });
});

// Webhook Verification (GET)
// Meta calls this when you configure your webhook in Facebook Developer settings.
router.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || "healix_token_123";

  if (mode && token) {
    if (mode === "subscribe" && token === verifyToken) {
      console.log("WHATSAPP WEBHOOK VERIFIED");
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }
  return res.sendStatus(400);
});

// Webhook Message Receiver (POST)
// Meta calls this when a user sends a message to the registered phone number.
router.post("/webhook", async (req, res) => {
  try {
    const { body } = req;

    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const change = entry?.changes?.[0];
      const value = change?.value;
      const message = value?.messages?.[0];

      if (message && message.type === "text") {
        const from = message.from; // User's phone number
        const text = message.text?.body; // User's message body
        const phoneNumberId = value.metadata?.phone_number_id;

        console.log(`[WhatsApp Webhook] Received from ${from}: "${text}"`);

        const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
        if (!accessToken) {
          console.warn("[WhatsApp Webhook] Access token is missing in .env. Skipping reply.");
          return res.sendStatus(200);
        }

        // Generate response using existing AI Service
        // Request the AI service to auto-detect language (Hindi/English) and format nicely
        const responseText = await aiService.askAI(text, "English or Hindi");

        // Send reply to user via Meta Graph API
        await axios.post(
          `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
          {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: from,
            type: "text",
            text: {
              preview_url: false,
              body: responseText
            }
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`
            }
          }
        );

        console.log(`[WhatsApp Webhook] Successfully replied to ${from}`);
      }

      return res.sendStatus(200);
    }

    return res.sendStatus(404);
  } catch (error) {
    console.error("[WhatsApp Webhook Error]:", error.response?.data || error.message);
    // Always return 200 to WhatsApp to avoid Meta retrying repeatedly and blocking the webhook
    return res.sendStatus(200);
  }
});

module.exports = router;
