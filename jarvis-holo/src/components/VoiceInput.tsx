import { useCallback, useEffect, useRef, useState } from 'react'

interface VoiceInputProps {
  listening: boolean
  onTranscript: (text: string, isFinal: boolean) => void
}

export default function VoiceInput({ listening, onTranscript }: VoiceInputProps) {
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const [error, setError] = useState<string | null>(null)

  const setup = useCallback(() => {
    const SpeechRecognitionImpl = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SpeechRecognitionImpl) {
      setError('SpeechRecognition not supported in this browser.')
      return
    }
    const recognition: SpeechRecognition = new SpeechRecognitionImpl()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i]
        const text = res[0]?.transcript ?? ''
        onTranscript(text, res.isFinal)
      }
    }
    recognition.onerror = (e) => setError((e as any).error || 'speech-error')
    recognition.onend = () => {
      if (listening) {
        try { recognition.start() } catch {}
      }
    }
    recognitionRef.current = recognition
  }, [listening, onTranscript])

  useEffect(() => { setup() }, [setup])

  useEffect(() => {
    const rec = recognitionRef.current
    if (!rec) return
    if (listening) {
      try { rec.start() } catch {}
    } else {
      rec.stop()
    }
  }, [listening])

  return (
    <div className="text-xs text-gray-400">{error ? `Voice error: ${error}` : 'Voice ready'}</div>
  )
}