const express = require("express");
const cors = require("cors");
const contentRoutes = require("./routes/content");

// Initialize Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:8080", // Frontend URL
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/content", contentRoutes);

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!"});
});

module.exports = app;
