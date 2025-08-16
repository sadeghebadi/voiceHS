
---

# Voice-to-JSON Extraction

A simple Node.js application that takes a voice/audio input, transcribes it using **Cartesia**, and extracts structured information using **OpenAI**.

---

## Features

* Upload audio files via a web interface
* Transcribe audio to text (supports English and Persian)
* Extract structured data (service type, time, address) in JSON format

---

## Requirements

* Node.js v18+
* npm
* Cartesia API key
* OpenAI API key

---

## Installation

1. Clone the repo:

```bash
git clone <your-repo-url>
cd <project-folder>
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root folder:

```env
CARTESIA_API_KEY=your_cartesia_api_key
OPENAI_API_KEY=your_openai_api_key
```

---

## Usage

1. Start the server:

```bash
node server.js
```

2. Open your browser and go to:

```
http://localhost:4000
```

3. Upload an audio file and see the transcript and extracted JSON result.

---

## File Structure

```
project/
 ├── server.js          # Main server file
 ├── .env               # Environment variables
 ├── uploads/           # Temporary uploaded audio files
 └── public/
      └── index.html    # Simple frontend for uploading audio
```

---

## Notes

* Make sure your audio file is in a supported format (MP3, WAV, etc.).
* The JSON extraction prompt is in English; you can modify it for other languages.

---

