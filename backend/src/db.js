const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // If we already have a connection, return
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB already connected");
      return;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection errors after initial connection
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    // Handle when the Node process is terminated
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
