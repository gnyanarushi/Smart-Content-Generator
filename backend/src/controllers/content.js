// Fetch images from Pexels API by category
exports.getPexelsImages = async (req, res) => {
  try {
    const { category, perPage } = req.query;
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }
    const images = await aiClient.getPexelsImages(
      category,
      perPage ? parseInt(perPage) : 5
    );
    res.json(images);
  } catch (error) {
    console.error("Error fetching images from Pexels:", error);
    res.status(500).json({ message: "Failed to fetch images from Pexels" });
  }
};
const mongoose = require("mongoose");
const Content = require("../models/content");
const aiClient = require("../aiClient");

// Generate image using AI
exports.generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    // Validate request
    if (!prompt) {
      return res.status(400).json({ message: "Image prompt is required" });
    }

    // Generate image using AI
    const { imageData, description } = await aiClient.generateImage(prompt);

    // Check if a similar image content already exists
    const existingContent = await Content.findOne({
      topic: prompt,
      type: "image",
      imageUrl: imageData,
      createdAt: { $gt: new Date(Date.now() - 5000) }, // Check last 5 seconds
    });

    if (existingContent) {
      console.log(
        "Duplicate image content detected, returning existing document"
      );
      return res.status(200).json(existingContent);
    }

    // Save to database
    const newContent = new Content({
      topic: prompt,
      type: "image",
      content: description,
      imageUrl: imageData,
      isFavorite: false,
    });

    const savedContent = await newContent.save();

    res.status(201).json(savedContent);
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ message: "Failed to generate image" });
  }
};

// Generate content using AI
exports.generateContent = async (req, res) => {
  try {
    let topic = req.body.topic;
    let type = req.body.type;
    let fileContent = null;

    // If a file is uploaded, read its content
    if (req.file) {
      const fs = require("fs");
      const path = require("path");
      const filePath = req.file.path;
      fileContent = fs.readFileSync(filePath, "utf-8");
      topic = topic || req.file.originalname;
      type = type || "file";
    }

    // Validate request
    if ((!topic || !type) && !fileContent) {
      return res
        .status(400)
        .json({ message: "Topic and type or file are required" });
    }

    // Generate content using AI or save direct content
    let generatedContent;
    if (fileContent) {
      generatedContent = await aiClient.generateContentFromFile(
        fileContent,
        type
      );
    } else if (req.body.content) {
      generatedContent = req.body.content;
    } else {
      generatedContent = await aiClient.generateContent(topic, type);
    }

    // Check if a similar content already exists
    const existingContent = await Content.findOne({
      topic: topic,
      type: type,
      content: generatedContent,
      createdAt: { $gt: new Date(Date.now() - 5000) }, // Check last 5 seconds
    });

    if (existingContent) {
      console.log("Duplicate content detected, returning existing document");
      return res.status(200).json(existingContent);
    }

    // Save to database
    const newContent = new Content({
      topic,
      type,
      content: generatedContent,
      imageUrl: req.body.imageUrl, // Add image URL if provided
      isFavorite: false, // Initialize favorite status
    });

    const savedContent = await newContent.save();
    res.status(201).json(savedContent);
  } catch (error) {
    console.error("Error generating content:", error);

    // Handle quota exceeded errors
    if (error.message && error.message.includes("quota exceeded")) {
      return res.status(429).json({
        message: "API quota exceeded. Please try again later.",
        error: "QUOTA_EXCEEDED",
        retryAfter: 60, // Suggest retry after 1 minute
      });
    }

    // Handle rate limiting
    if (error.message && error.message.includes("Rate limit")) {
      return res.status(429).json({
        message: "Too many requests. Please try again in a few seconds.",
        error: "RATE_LIMITED",
        retryAfter: 5, // Suggest retry after 5 seconds
      });
    }

    res.status(500).json({
      message: "Failed to generate content",
      error: error.message,
    });
  }
};

// Get all contents
exports.getAllContents = async (req, res) => {
  try {
    const contents = await Content.find().sort({ createdAt: -1 });
    res.json(contents);
  } catch (error) {
    console.error("Error fetching contents:", error);
    res.status(500).json({ message: "Failed to fetch contents" });
  }
};

// Get content by ID
exports.getContentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid content ID format",
        error: "INVALID_ID",
      });
    }

    const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({
        message: "Content not found",
        error: "NOT_FOUND",
      });
    }

    res.json(content);
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({
      message: "Failed to fetch content",
      error: error.message,
    });
  }
};

// Toggle favorite status
exports.toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid content ID format",
        error: "INVALID_ID",
      });
    }

    const content = await Content.findById(id);
    if (!content) {
      return res.status(404).json({
        message: "Content not found",
        error: "NOT_FOUND",
      });
    }

    // Toggle the favorite status
    content.isFavorite = !content.isFavorite;
    await content.save();

    res.json(content);
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({
      message: "Failed to update favorite status",
      error: error.message,
    });
  }
};

// Get favorite contents
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Content.find({ isFavorite: true }).sort({
      createdAt: -1,
    });
    res.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({
      message: "Failed to fetch favorites",
      error: error.message,
    });
  }
};
