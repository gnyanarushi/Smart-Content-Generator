const express = require("express");
const cors = require("cors");
const contentRoutes = require("./routes/content");

// Initialize Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000", // Local development (Vite default)
      "http://localhost:8080", // Local development (alternative)
      "http://localhost:5173", // Local development (Vite dev server)
      "http://localhost:4173", // Local development (Vite preview)
      "https://smart-content-generator.vercel.app", // Production frontend URL (Vercel)
      "https://smart-content-generator-git-main-gnyanarushi.vercel.app", // Vercel preview deployments
      /^https:\/\/smart-content-generator-.*\.vercel\.app$/, // All Vercel preview deployments
    ],
    credentials: true,
  })
);
app.use(express.json());

// Add a basic health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Smart Content Generator API is running",
    timestamp: new Date().toISOString(),
    cors: {
      origin: req.get("Origin"),
      allowed: true,
    },
  });
});

// Routes
app.use("/api/content", contentRoutes);

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

module.exports = app;
