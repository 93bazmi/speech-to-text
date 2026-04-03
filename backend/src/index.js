import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Route ทดสอบ
app.get("/", (req, res) => {
  res.send("Hello! Backend Server is running.");
});

// ทดสอบเชื่อมต่อ Google Cloud API
app.get("/api/test", async (req, res) => {
  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || "unknown";
    res.json({
      status: "success",
      message: "Google Cloud APIs connected successfully",
      project_id: projectId,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// แปลภาษา (MyMemory Translate API - ฟรี)
app.post("/api/translate", async (req, res) => {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;

    if (!text || !sourceLanguage || !targetLanguage) {
      return res.status(400).json({
        error: "Missing required fields: text, sourceLanguage, targetLanguage",
      });
    }

    const langpair = `${sourceLanguage.split("-")[0]}|${targetLanguage.split("-")[0]}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || data.responseStatus !== 200) {
      throw new Error(data.responseDetails || "Translation failed");
    }

    res.json({ translation: data.responseData.translatedText });
  } catch (error) {
    console.error("Translation API error:", error);
    res.status(500).json({ error: error.message });
  }
});

// API Ping

app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
