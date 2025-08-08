import { useCallback, useMemo, useState } from 'react'
import './index.css'
import WakeWordListener from './components/WakeWordListener'
import VoiceInput from './components/VoiceInput'
import VoiceOutput from './components/VoiceOutput'
import ChatEngine from './components/ChatEngine'
import BrowserSimulator from './components/BrowserSimulator'
import FileUploadAnalyzer from './components/FileUploadAnalyzer'
import HologramDisplay from './components/HologramDisplay'

function App() {
  const [awake, setAwake] = useState(false)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [query, setQuery] = useState<string | null>(null)
  const [pendingTranscript, setPendingTranscript] = useState('')

  const onWake = useCallback(() => {
    setAwake(true)
    setListening(true)
  }, [])

  const handleTranscript = useCallback((text: string, isFinal: boolean) => {
    if (!text) return
    const t = (pendingTranscript + ' ' + text).trim()
    setPendingTranscript(t)
    if (isFinal) {
      // Detect search intent
      const m = t.toLowerCase().match(/^jarvis,?\s*(search|find|google)\s+(.+)/)
      if (m) {
        setQuery(m[2])
      }
      setPendingTranscript('')
    }
  }, [pendingTranscript])

  const [ttsText, setTtsText] = useState<string | null>(null)
  const speak = useCallback((text: string) => {
    setTtsText(text)
    setSpeaking(true)
  }, [])

  const voiceText = useMemo(() => (speaking ? ttsText : null), [speaking, ttsText])

  return (
    <div className="min-h-screen holo-grid">
      <WakeWordListener onWake={onWake} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold holo-glow">JARVIS</h1>
          <div className="text-cyan-300 text-sm">{awake ? 'Active' : 'Say "Jarvis" to wake'}</div>
        </header>

        <main className="grid md:grid-cols-3 gap-6">
          <section className="md:col-span-2 space-y-6">
            <div className="holo-card p-4 md:p-6">
              <h2 className="text-cyan-300 mb-3">Chat</h2>
              <ChatEngine onSpeak={speak} />
            </div>

            <div className="holo-card p-4 md:p-6">
              <h2 className="text-cyan-300 mb-3">Browser Simulator</h2>
              <BrowserSimulator query={query} />
            </div>

            <div className="holo-card p-4 md:p-6">
              <h2 className="text-cyan-300 mb-3">File Analyzer</h2>
              <FileUploadAnalyzer />
            </div>
          </section>

          <aside className="space-y-6">
            <div className="holo-card p-4 md:p-6">
              <h2 className="text-cyan-300 mb-3">Hologram</h2>
              <HologramDisplay speaking={speaking} thinking={listening && !speaking} />
            </div>

            <div className="holo-card p-4 md:p-6 space-y-3">
              <h2 className="text-cyan-300 mb-3">Voice</h2>
              <div className="flex items-center gap-2 text-sm">
                <span>Status:</span>
                <span className="text-cyan-300">{listening ? 'Listening' : 'Idle'}</span>
              </div>
              <button
                onClick={() => setListening((v) => !v)}
                className="px-3 py-2 rounded bg-cyan-500 text-black text-sm"
              >{listening ? 'Stop Listening' : 'Start Listening'}</button>
              <VoiceInput listening={listening} onTranscript={handleTranscript} />
              <VoiceOutput text={voiceText} speaking={speaking} onEnd={() => setSpeaking(false)} />
            </div>
          </aside>
        </main>
      </div>
    </div>
  )
}

export default App
