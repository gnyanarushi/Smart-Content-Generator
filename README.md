# 🚀 AI Smart Content Creation

A **Node.js + Express** backend application that generates content using the **Google Gemini API** and stores it in **MongoDB Atlas**.

---

## ✨ Features

- ✅ Generate text content using AI based on **topic** and **type**
- ✅ Process **image-related prompts** using Gemini Pro Vision _(Image generation feature coming soon)_
- ✅ Fetch all generated contents
- ✅ Fetch specific content by **ID**
- ✅ Store all generated contents in **MongoDB Atlas**

> ⚠️ Note: Direct image generation with Gemini is currently in limited preview and not yet generally available. The current implementation processes image-related prompts and returns descriptions.

---

## 📂 Project Structure

```
src/
├── app.js              # Express app setup
├── server.js           # Entry point
├── db.js               # MongoDB Atlas connection
├── routes/content.js   # REST API routes
├── controllers/content.js # Handles API logic
├── models/content.js   # Mongo schema: { topic, type, content, createdAt }
└── aiClient.js         # Calls Google Gemini API
```

---

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- [Google AI API Key](https://ai.google.dev/) (with access to Gemini 2.0 Flash Preview)
- [Pexels API Key](https://www.pexels.com/api/)

---

## ⚡ Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository_url>
   cd Smart_content_creation
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a .env file in the root directory:**

   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://rishi:<db_password>@cluster0.vgvkdlz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   GEMINI_API_KEY=your_gemini_api_key
   PEXELS_API_KEY=your_pexels_api_key
   ```

   **Replace:**

   - `<db_password>` → your actual MongoDB password
   - `your_gemini_api_key` → your Google Gemini API key
   - `your_pexels_api_key` → your Pexels API key

4. **Start the server**

   ```bash
   npm start
   ```

   **For development with automatic restarts:**

   ```bash
   npm run dev
   ```

---

## 🖼️ Get Images from Pexels

**Endpoint:**

```
GET /api/content/pexels-images?category=<category>&perPage=<number>
```

**Example Request:**

```bash
curl -X GET "https://smart-content-generator.onrender.com/api/content/pexels-images?category=sunset&perPage=3"
```

**Response:**

```json
[
  {
    "url": "https://images.pexels.com/photos/12345/pexels-photo-12345.jpeg",
    "photographer": "John Doe",
    "alt": "A beautiful sunset over the ocean"
  }
]
```

---

## 📘 API Documentation

### 1. Generate Content

**Endpoint:**

```
POST /api/content/generate
```

**Request Body (JSON):**

```json
{
  "topic": "Artificial Intelligence",
  "type": "blog post"
}
```

**Request Body (Multipart Form, file upload):**

- `file`: The file to upload (any text-based file)
- `type`: (optional) type of content (summary, blog post, etc.)

**Example (file upload via curl):**

```bash
curl -X POST https://smart-content-generator.onrender.com/api/content/generate \
  -F "file=@/path/to/your/file.txt" \
  -F "type=summary"
```

**Response:**

```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "topic": "Artificial Intelligence",
  "type": "blog post",
  "content": "Generated content text...",
  "createdAt": "2023-06-22T14:30:45.123Z"
}
```

### 2. Get All Contents

**Endpoint:**

```
GET /api/content
```

**Response:**

```json
[
  {
    "_id": "60d21b4667d0d8992e610c85",
    "topic": "Artificial Intelligence",
    "type": "blog post",
    "content": "Generated content text...",
    "createdAt": "2023-06-22T14:30:45.123Z"
  },
  {
    "_id": "60d21b4667d0d8992e610c86",
    "topic": "Machine Learning",
    "type": "tutorial",
    "content": "Generated content text...",
    "createdAt": "2023-06-22T14:35:12.456Z"
  }
]
```

### 3. Generate Image

**Endpoint:**

```
POST /api/content/generate-image
```

**Request Body:**

```json
{
  "prompt": "A 3D rendered image of a pig with wings and a top hat flying over a futuristic city"
}
```

**Response:**

```json
{
  "_id": "60d21b4667d0d8992e610c87",
  "topic": "A 3D rendered image of a pig with wings...",
  "type": "image",
  "content": "Generated image description...",
  "imageUrl": "base64_encoded_image_data...",
  "createdAt": "2023-06-22T14:40:22.789Z"
}
```

### 4. Get Content by ID

**Endpoint:**

```
GET /api/content/:id
```

**Response:**

```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "topic": "Artificial Intelligence",
  "type": "blog post",
  "content": "Generated content text...",
  "createdAt": "2023-06-22T14:30:45.123Z"
}
```

---

## 🧪 Testing the API

### Using cURL

**Generate content:**

```bash
curl -X POST https://smart-content-generator.onrender.com/api/content/generate \
  -H "Content-Type: application/json" \
  -d '{"topic":"Climate Change","type":"essay"}'
```

**Get all contents:**

```bash
curl -X GET https://smart-content-generator.onrender.com/api/content
```

**Generate an image:**

```bash
curl -X POST https://smart-content-generator.onrender.com/api/content/generate-image \
  -H "Content-Type: application/json" \
  -d '{"prompt":"A 3D rendered image of a pig with wings and a top hat flying over a futuristic city"}'
```

**Get content by ID:**

```bash
curl -X GET https://smart-content-generator.onrender.com/api/content/60d21b4667d0d8992e610c85
```

### Using Postman

1. Set the request URL and method (GET/POST).
2. For POST requests → go to the **Body** tab → select **raw** → **JSON**.
3. Enter the request body.
4. Click **Send** to execute.
