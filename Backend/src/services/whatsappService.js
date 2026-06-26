const { Client, LocalAuth } = require("whatsapp-web.js");
const qrTerminal = require("qrcode-terminal");
const QRCode = require("qrcode");
const aiService = require("./aiService");

let clientInstance = null;
let qrCodeValue = null;
let qrImageDataUri = null;
let connectionStatus = "disconnected"; // "disconnected", "initializing", "qr", "ready"

function getWhatsAppStatus() {
  return {
    status: connectionStatus,
    qr: qrCodeValue,
    qrImage: qrImageDataUri
  };
}

function initializeWhatsApp() {
  console.log("[WhatsApp Service] Initializing WhatsApp bot...");
  connectionStatus = "initializing";

  // Instantiate client pointing to the system's Google Chrome executable
  const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      executablePath: "/usr/bin/google-chrome",
      headless: true,
      protocolTimeout: 120000,
      timeout: 120000,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu"
      ]
    }
  });

  client.on("qr", async (qr) => {
    qrCodeValue = qr;
    connectionStatus = "qr";

    // Generate base64 data URI for the frontend
    try {
      qrImageDataUri = await QRCode.toDataURL(qr, { width: 300, margin: 2 });
    } catch (e) {
      console.error("[WhatsApp Service] Failed to generate QR image:", e.message);
      qrImageDataUri = null;
    }

    console.log("\n==========================================================================");
    console.log("[WhatsApp Service] SCAN THE QR CODE BELOW TO CONNECT YOUR BOT:");
    console.log("==========================================================================\n");
    qrTerminal.generate(qr, { small: true });
    console.log("\n==========================================================================\n");
  });

  client.on("ready", () => {
    qrCodeValue = null;
    qrImageDataUri = null;
    connectionStatus = "ready";

    console.log("\n==========================================================================");
    console.log("[WhatsApp Service] SUCCESS: WhatsApp Bot is connected and ready to respond!");
    console.log("==========================================================================\n");
  });

  client.on("authenticated", () => {
    console.log("[WhatsApp Service] Link successful! Authenticated. Loading session details...");
  });

  client.on("auth_failure", (msg) => {
    console.error("[WhatsApp Service] Authentication failed:", msg);
  });

  client.on("disconnected", (reason) => {
    console.log(`[WhatsApp Service] Disconnected. Reason: ${reason}`);
    qrCodeValue = null;
    qrImageDataUri = null;
    connectionStatus = "disconnected";
  });

  client.on("message", async (msg) => {
    try {
      // Ignore group chats, broadcast messages, and status updates
      if (msg.from.includes("@g.us") || msg.from === "status@broadcast") {
        return;
      }

      console.log(`[WhatsApp Bot] Message from ${msg.from}: "${msg.body}"`);

      // Generate response using existing AI Service (detects language auto)
      const responseText = await aiService.askAI(msg.body, "English or Hindi");

      // Reply directly to the sender's message
      await msg.reply(responseText);
      console.log(`[WhatsApp Bot] Successfully replied to ${msg.from}`);
    } catch (err) {
      console.error("[WhatsApp Bot Error]:", err.message);
    }
  });

  process.on("unhandledRejection", (reason) => {
    console.warn("[WhatsApp Service Warning] Caught unhandled rejection:", reason?.message || reason);
  });

  process.on("uncaughtException", (err) => {
    console.warn("[WhatsApp Service Warning] Caught uncaught exception:", err?.message || err);
  });

  client.initialize().catch((err) => {
    console.error("[WhatsApp Service] Initial initialization catch:", err.message);
    qrCodeValue = null;
    connectionStatus = "disconnected";
  });
  clientInstance = client;
}

module.exports = {
  initializeWhatsApp,
  getWhatsAppStatus
};
