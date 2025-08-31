const express = require("express");
const router = express.Router();
const contentController = require("../controllers/content");
const chatController = require("../controllers/chat");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Generate content using AI (accepts file upload)
router.post(
  "/generate",
  upload.single("file"),
  contentController.generateContent
);

// Generate image using AI
router.post("/generate-image", contentController.generateImage);

// Get images from Pexels (must be before :id route)
router.get("/pexels-images", contentController.getPexelsImages);

// Handle chat messages
router.post("/chat", chatController.handleChatMessage);

// Get favorite contents (must be before /:id route)
router.get("/favorites", contentController.getFavorites);

// Get all contents
router.get("/", contentController.getAllContents);

// Get content by ID
router.get("/:id", contentController.getContentById);

// Toggle favorite status
router.post("/:id/favorite", contentController.toggleFavorite);

module.exports = router;
