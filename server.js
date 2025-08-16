import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 4000;

// Multer for file uploads
const upload = multer({ dest: "uploads/" });

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Cartesia client (OpenAI-compatible)
const cartesia = new OpenAI({
  apiKey: process.env.CARTESIA_API_KEY,
  baseURL: "https://api.cartesia.ai",
  defaultHeaders: {
    "Cartesia-Version": "2025-04-16",
  },
});

// Serve static HTML
app.use(express.static(path.join(__dirname, "public")));

// Upload + Process
app.post("/upload-audio", upload.single("audio"), async (req, res) => {
  try {
    const audioPath = req.file.path;

    // 1) Transcribe with Cartesia
    const transcription = await cartesia.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "ink-whisper",
      language: "en", // or "fa"
      timestamp_granularities: ["word"],
    });

    console.log("Transcript:", transcription.text);

    // 2) Process with OpenAI
    const prompt = `
    The following text is a customer request. 
    Extract the following information and return it ONLY as valid JSON.
    You MUST return a raw JSON object, without any code block, markdown, or explanation.
    
    Keys:
    - service_type (e.g. plumber, electrician, cleaning service)
    - time
    - address
    

Text: "${transcription.text}"
    `;

    const gptRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
    let rawContent = gptRes.choices[0].message.content.trim();

    // remove markdown code fences if present
    rawContent = rawContent.replace(/```json|```/g, "").trim();
    
    let structuredData;
    try {
      structuredData = JSON.parse(rawContent);
    } catch (e) {
      console.error("JSON parse error:", rawContent);
      return res.status(500).json({ error: "Failed to parse JSON" });
    }

    // 3) Response
    res.json({
      status: "success",
      transcript: transcription.text,
      extracted: structuredData,
    });

    // Remove temp file
    fs.unlinkSync(audioPath);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
