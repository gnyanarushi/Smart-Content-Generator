require("dotenv").config();
const app = require("./app");
const connectDB = require("./db");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB

// Start server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
