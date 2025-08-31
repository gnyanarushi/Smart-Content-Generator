// Function to generate content from file using Google Gemini API
exports.generateContentFromFile = async (fileContent, type, retryCount = 0) => {
  try {
    // Check quota
    if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
      throw {
        status: 429,
        message: "Rate limit exceeded",
        isQuotaError: true,
      };
    }

    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await wait(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
    }

    // Update rate limiting trackers
    lastRequestTime = Date.now();
    requestCount++;

    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = "models/gemini-1.5-flash";
    const apiUrl = `https://generativelanguage.googleapis.com/v1/${modelName}:generateContent?key=${apiKey}`;

    const requestData = {
      contents: [
        {
          parts: [
            {
              text: `Generate ${type} content based on the following file:\n${fileContent}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800, // Reduced token limit
      },
    };

    const response = await axios.post(apiUrl, requestData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates.length > 0
    ) {
      const content = response.data.candidates[0].content;
      if (content.parts && content.parts.length > 0) {
        return content.parts[0].text.trim();
      }
    }

    throw new Error("Unexpected response format from Gemini API");
  } catch (error) {
    console.error(
      "Error calling Google Gemini API with file:",
      error.response ? error.response.data : error.message
    );

    // Handle rate limiting and quota errors
    if (
      (error.response?.data?.error?.code === 429 || error.status === 429) &&
      retryCount < 2
    ) {
      const retryDelay = error.response?.data?.error?.details
        ? getRetryDelay(error.response.data.error)
        : Math.max(20000, Math.pow(2, retryCount + 1) * 5000);

      console.log(`Rate limited. Retrying in ${retryDelay}ms...`);
      await wait(retryDelay);
      return this.generateContentFromFile(fileContent, type, retryCount + 1);
    }

    // If we've exhausted retries or hit a hard quota limit
    if (error.response?.data?.error?.code === 429 || error.status === 429) {
      throw new Error(
        "API quota exceeded. Please try again later or contact support to upgrade your plan."
      );
    }

    throw new Error(
      "Failed to generate content from file using AI: " +
        (error.response?.data?.error?.message || error.message)
    );
  }
};
// Function to fetch images from Pexels API by category/keyword
exports.getPexelsImages = async (category, perPage = 5) => {
  try {
    const apiKey = process.env.PEXELS_API_KEY;
    const apiUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      category
    )}&per_page=${perPage}`;

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: apiKey,
      },
    });

    // Return array of image URLs and metadata
    return response.data.photos.map((photo) => ({
      url: photo.src.medium,
      photographer: photo.photographer,
      alt: photo.alt,
    }));
  } catch (error) {
    console.error("Error fetching images from Pexels:", error);
    throw new Error("Failed to fetch images from Pexels");
  }
};
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to generate content using Google Gemini API
exports.generateContent = async (topic, type) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = "models/gemini-1.5-flash"; // Using a model we confirmed works

    const apiUrl = `https://generativelanguage.googleapis.com/v1/${modelName}:generateContent?key=${apiKey}`;

    const requestData = {
      contents: [
        {
          parts: [
            {
              text: `Generate a well-structured and detailed ${type} on the topic: "${topic}".

        Guidelines:
        1. Depth & Clarity:
          - Provide insightful, fact-based, and coherent content.
          - Explain key concepts clearly for both beginners and experts.  

        2. Structure:
          - Start with an engaging introduction.  
          - Organize content into clear sections with headings/subheadings.  
          - Add bullet points, numbered lists, or examples where helpful.  
          - End with a strong conclusion or summary.  

        3. Style & Tone:
          - Keep the tone professional yet engaging.  
          - Avoid redundancy, filler content, or vague explanations.  
          - Where relevant, add practical insights, real-world use cases, or best practices.  

        4. Extra:
          - If the topic involves processes or workflows, present them step-by-step.  
          - If the topic has pros/cons, advantages/disadvantages, or comparisons, include them.  
          - Ensure the content flows naturally and is easy to read.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    };

    const response = await axios.post(apiUrl, requestData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates.length > 0
    ) {
      const content = response.data.candidates[0].content;
      if (content.parts && content.parts.length > 0) {
        return content.parts[0].text.trim();
      }
    }

    throw new Error("Unexpected response format from Gemini API");
  } catch (error) {
    console.error(
      "Error calling Google Gemini API:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to generate content using AI");
  }
};

// Function to generate image using Google Gemini API
exports.generateImage = async (prompt, base64Image) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Prepare the request for vision tasks
    const result = await model.generateContent(
      [
        { text: prompt || "Describe this image" },
        base64Image
          ? { inlineData: { mimeType: "image/png", data: base64Image } }
          : undefined,
      ].filter(Boolean)
    );

    const response = await result.response;
    const content = response.text();

    // Return the description and optionally the image data
    return {
      imageData: base64Image || "placeholder_image_data",
      description: content || prompt,
    };
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image using AI");
  }
};

// Utility function for exponential backoff
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Rate limiting configuration
let lastRequestTime = 0;
let requestCount = 0;
const MIN_REQUEST_INTERVAL = 5000; // 5 seconds between requests
const MAX_REQUESTS_PER_MINUTE = 10;
const QUOTA_RESET_INTERVAL = 60000; // 1 minute

// Reset request count periodically
setInterval(() => {
  requestCount = 0;
}, QUOTA_RESET_INTERVAL);

// Function to extract retry delay from error
const getRetryDelay = (error) => {
  try {
    const retryInfo = error.errorDetails?.find((d) =>
      d["@type"]?.includes("RetryInfo")
    );
    if (retryInfo?.retryDelay) {
      const seconds = parseInt(retryInfo.retryDelay.replace("s", ""));
      return (seconds + 1) * 1000; // Convert to ms and add 1 second buffer
    }
  } catch (e) {
    console.error("Error parsing retry delay:", e);
  }
  return 20000; // Default to 20 seconds if we can't parse the delay
};

// Function to handle chat messages using Google Gemini API
exports.generateChat = async (message, retryCount = 0) => {
  try {
    // Check quota
    if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
      throw { status: 429, message: "Rate limit exceeded" };
    }

    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await wait(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
    }

    // Update rate limiting trackers
    lastRequestTime = Date.now();
    requestCount++;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // Use flash model instead of pro
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500, // Further reduced token limit
      },
    });

    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error generating chat response:", error);

    // Handle rate limiting errors
    if (error.status === 429 && retryCount < 2) {
      // Reduced max retries
      const retryDelay = error.errorDetails
        ? getRetryDelay(error) // Use server-provided delay if available
        : Math.max(20000, Math.pow(2, retryCount + 1) * 5000); // Minimum 20s, then exponential

      console.log(`Rate limited. Retrying in ${retryDelay}ms...`);
      await wait(retryDelay);
      return this.generateChat(message, retryCount + 1);
    }

    // If we've exceeded retries or it's a different error, provide a user-friendly response
    if (error.status === 429) {
      return "I'm currently experiencing high demand. Please wait a few moments and try again. In the meantime, you can still use other features like content generation or image search.";
    }

    // For other errors, provide a more specific error message
    return "I encountered an issue processing your message. Please try rephrasing your question or using simpler language.";
  }
};
