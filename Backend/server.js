require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db");

const assessmentRoutes = require("./src/routes/assessmentRoutes");
const languageRoutes = require("./src/routes/languageRoutes");
const medicineRoutes = require("./src/routes/medicineRoutes");
const awarenessRoutes = require("./src/routes/awarenessRoutes");
const chatRoutes = require("./src/routes/chatRoutes");
const misinfoRoutes = require("./src/routes/misinfoRoutes");
const placesRoutes = require("./src/routes/placesRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/assessment", assessmentRoutes);
app.use("/api/language", languageRoutes);
app.use("/api/medicine", medicineRoutes);
app.use("/api/awareness", awarenessRoutes);
app.use("/api/healix/chat", chatRoutes);
app.use("/api/healix/misinfo", misinfoRoutes);
app.use("/api/healix/places", placesRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Health AI Backend Running"
  });
});

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});

// Graceful shutdown - ensures port is released when nodemon restarts
const shutdown = () => {
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
