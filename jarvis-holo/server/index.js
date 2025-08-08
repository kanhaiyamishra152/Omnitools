import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID
const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY

app.post('/api/chat', async (req, res) => {
  try {
    const messages = req.body.messages ?? []
    const prompt = messages.map((m) => `${m.role}: ${m.content}`).join('\n')

    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    })
    const data = await geminiRes.json()
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '...'
    res.json({ reply })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'chat_failed' })
  }
})

app.get('/api/search', async (req, res) => {
  try {
    const q = String(req.query.q || '')
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_CSE_ID}&q=${encodeURIComponent(q)}`
    const r = await fetch(url)
    const data = await r.json()
    const results = (data.items || []).map((it) => ({ title: it.title, link: it.link, snippet: it.snippet }))
    res.json({ results })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'search_failed' })
  }
})

app.post('/api/tts', async (req, res) => {
  try {
    const text = String(req.body.text || '')
    const voiceId = '21m00Tcm4TlvDq8ikWAM' // Rachel default
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVEN_LABS_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({ text, voice_settings: { stability: 0.4, similarity_boost: 0.8 } })
    })
    const buf = Buffer.from(await r.arrayBuffer())
    res.setHeader('Content-Type', 'audio/mpeg')
    res.send(buf)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'tts_failed' })
  }
})

const port = process.env.PORT || 5174
app.listen(port, () => console.log(`API server running on http://localhost:${port}`))