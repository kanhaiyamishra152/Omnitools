# JARVIS — Sci‑Fi AI Assistant (MVP)

React + Vite + TypeScript frontend with Tailwind CSS and a minimal Express backend to securely access Gemini, Google Programmable Search, and ElevenLabs TTS.

## Quick start

1. Copy `.env.example` to `.env` and fill your keys:

```
GEMINI_API_KEY=...
GOOGLE_SEARCH_API_KEY=...
GOOGLE_CSE_ID=...
ELEVEN_LABS_API_KEY=...
```

2. Install and run:

```
npm install
npm run dev
```

- Client: http://localhost:5173
- API: http://localhost:5174

The Vite dev server proxies `/api/*` to the backend.

## Features
- Wake word detection ("Jarvis") using Web Speech API
- Voice input (STT), voice output (TTS via ElevenLabs)
- Gemini chat backend
- Google Programmable Search integration with a browser-like simulator
- File upload and analysis via Gemini
- Holographic sci‑fi UI with Tailwind

## Notes
- Web Speech API availability varies by browser. Chrome is recommended.
- Keys are only used on the server. Do not expose them to the client.
