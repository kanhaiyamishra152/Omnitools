import { useEffect, useRef } from 'react'

interface WakeWordListenerProps {
  wakeWord?: string
  onWake: () => void
  active?: boolean
}

export default function WakeWordListener({ wakeWord = 'jarvis', onWake, active = true }: WakeWordListenerProps) {
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const isListeningRef = useRef(false)

  useEffect(() => {
    const SpeechRecognitionImpl = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SpeechRecognitionImpl) return

    const recognition: SpeechRecognition = new SpeechRecognitionImpl()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((res) => res[0]?.transcript || '')
        .join(' ')
        .toLowerCase()
      if (transcript.includes(wakeWord.toLowerCase())) {
        onWake()
      }
    }

    recognition.onend = () => {
      if (isListeningRef.current) {
        try { recognition.start() } catch {}
      }
    }

    recognitionRef.current = recognition

    return () => {
      recognition.stop()
      recognitionRef.current = null
      isListeningRef.current = false
    }
  }, [onWake, wakeWord])

  useEffect(() => {
    const rec = recognitionRef.current
    if (!rec) return
    if (active && !isListeningRef.current) {
      try { rec.start(); isListeningRef.current = true } catch {}
    } else if (!active && isListeningRef.current) {
      rec.stop(); isListeningRef.current = false
    }
  }, [active])

  return null
}