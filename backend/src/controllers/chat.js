const aiClient = require("../aiClient");

// Queue and rate limiting configuration
let messageQueue = [];
let isProcessing = false;
let lastProcessedTime = 0;
const MIN_PROCESS_INTERVAL = 5000; // 5 seconds between processing messages
const MAX_QUEUE_SIZE = 3; // Reduced queue size

// Process messages from the queue with rate limiting
async function processMessageQueue() {
  if (isProcessing || messageQueue.length === 0) return;

  const now = Date.now();
  const timeSinceLastProcess = now - lastProcessedTime;

  if (timeSinceLastProcess < MIN_PROCESS_INTERVAL) {
    setTimeout(
      processMessageQueue,
      MIN_PROCESS_INTERVAL - timeSinceLastProcess
    );
    return;
  }

  isProcessing = true;
  const { message, res } = messageQueue.shift();

  try {
    lastProcessedTime = Date.now();
    const response = await aiClient.generateChat(message);
    const chatMessage = {
      id: Date.now().toString(),
      role: "assistant",
      content: response,
      timestamp: new Date().toISOString(),
    };
    res.json(chatMessage);
  } catch (error) {
    console.error("Error processing queued message:", error);
    const statusCode = error.status === 429 ? 429 : 500;
    const errorMessage =
      error.status === 429
        ? "The service is experiencing high demand. Please wait a moment before trying again."
        : "Failed to process your message. Please try again.";

    res.status(statusCode).json({
      message: errorMessage,
      queuePosition: messageQueue.length,
    });
  } finally {
    isProcessing = false;
    if (messageQueue.length > 0) {
      setTimeout(processMessageQueue, MIN_PROCESS_INTERVAL);
    }
  }
}

// Handle chat messages
exports.handleChatMessage = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate request
    if (!message) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    // Check message length and complexity
    if (message.length > 500) {
      return res.status(400).json({
        message:
          "Message is too long. Please keep your messages under 500 characters.",
      });
    }

    // Queue management
    if (isProcessing || messageQueue.length > 0) {
      if (messageQueue.length >= MAX_QUEUE_SIZE) {
        return res.status(429).json({
          message:
            "The chat service is currently at capacity. Please try again in a few moments.",
          estimatedWaitTime: `${
            (messageQueue.length + 1) * (MIN_PROCESS_INTERVAL / 1000)
          } seconds`,
        });
      }

      // Add to queue with position info
      messageQueue.push({ message, res });
      return res.status(202).json({
        message: "Your message has been queued and will be processed shortly.",
        queuePosition: messageQueue.length,
        estimatedWaitTime: `${
          messageQueue.length * (MIN_PROCESS_INTERVAL / 1000)
        } seconds`,
      });
    }

    // Process immediately if no queue
    const now = Date.now();
    const timeSinceLastProcess = now - lastProcessedTime;

    if (timeSinceLastProcess < MIN_PROCESS_INTERVAL) {
      // If too soon after last process, queue instead
      messageQueue.push({ message, res });
      setTimeout(
        processMessageQueue,
        MIN_PROCESS_INTERVAL - timeSinceLastProcess
      );
      return res.status(202).json({
        message: "Your message will be processed shortly.",
        estimatedWaitTime: `${MIN_PROCESS_INTERVAL / 1000} seconds`,
      });
    }

    // Process message if all checks pass
    lastProcessedTime = now;
    const response = await aiClient.generateChat(message);
    const chatMessage = {
      id: Date.now().toString(),
      role: "assistant",
      content: response,
      timestamp: new Date().toISOString(),
    };

    res.json(chatMessage);
  } catch (error) {
    console.error("Error handling chat message:", error);

    // Enhanced error handling
    const statusCode = error.status === 429 ? 429 : 500;
    const errorMessage = {
      message:
        error.status === 429
          ? "The service is experiencing high demand. Please try again in a few moments."
          : "An error occurred while processing your message. Please try again.",
      suggestion:
        error.status === 429
          ? "Consider using simpler messages or try again during off-peak hours."
          : "Try rephrasing your message or breaking it into smaller parts.",
      retryAfter: error.status === 429 ? 20 : 5,
    };

    res.status(statusCode).json(errorMessage);
  }
};
