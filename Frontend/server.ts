import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5001";

async function startServer() {
  const app = express();
  const PORT = 5000;

  // Middleware
  app.use(express.json());

  // Proxy all /api requests to the Express backend (Groq-powered)
  app.use("/api", async (req, res) => {
    try {
      const targetUrl = `${BACKEND_URL}${req.originalUrl}`;
      console.log(`[Proxy] ${req.method} ${targetUrl}`);
      
      const fetchOptions: RequestInit = {
        method: req.method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Include body for POST/PUT/PATCH requests
      if (["POST", "PUT", "PATCH"].includes(req.method)) {
        fetchOptions.body = JSON.stringify(req.body);
      }

      const response = await fetch(targetUrl, fetchOptions);
      const data = await response.json();
      
      res.status(response.status).json(data);
    } catch (error: any) {
      console.error("Backend Proxy Error:", error.message);
      console.error("Error cause:", error.cause);
      res.status(502).json({ 
        error: `Could not connect to backend at ${BACKEND_URL}. Make sure the backend server is running.` 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "localhost", () => {
    console.log(`Healix frontend server running on http://localhost:${PORT}`);
    console.log(`API requests proxied to backend at ${BACKEND_URL}`);
  });
}

startServer();
