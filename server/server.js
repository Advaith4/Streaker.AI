const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const connectDB      = require("./config/db");
const userRoutes     = require("./routes/userRoutes");
const authRoutes     = require("./routes/authRoutes");
const problemRoutes  = require("./routes/problemRoutes");
const dailyRoutes    = require("./routes/dailyRoutes");
const solveRoutes    = require("./routes/solveRoutes");
const historyRoutes  = require("./routes/historyRoutes");
const notesRoutes    = require("./routes/notesRoutes");

const app = express();

// CORS — allow any origin in production (set CORS_ORIGIN in .env for stricter control)
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(o => o.trim())
  : ["http://localhost:3000"];

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
      return cb(null, true);
    }
    cb(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json({ limit: "1mb" }));

connectDB();

// Routes
app.use("/api/auth",     authRoutes);
app.use("/api/users",    userRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/daily",    dailyRoutes);
app.use("/api/solve",    solveRoutes);
app.use("/api/history",  historyRoutes);
app.use("/api/notes",    notesRoutes);

// Health check
app.get("/", (_req, res) => res.json({ status: "ok", app: "Streaker.ai API" }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Streaker.ai server running on port ${PORT}`));