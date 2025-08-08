import { useEffect, useRef, useState } from 'react'

interface VoiceOutputProps {
  text: string | null
  speaking: boolean
  onEnd?: () => void
}

export default function VoiceOutput({ text, speaking, onEnd }: VoiceOutputProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!speaking || !text) return
    let aborted = false

    ;(async () => {
      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        })
        if (!res.ok) throw new Error(`TTS failed: ${res.status}`)
        const blob = await res.blob()
        if (aborted) return
        const url = URL.createObjectURL(blob)
        if (!audioRef.current) audioRef.current = new Audio()
        const audio = audioRef.current
        audio.src = url
        audio.onended = () => { onEnd?.(); URL.revokeObjectURL(url) }
        await audio.play()
      } catch (e: any) {
        setError(e.message || 'tts-error')
      }
    })()

    return () => { aborted = true }
  }, [speaking, text, onEnd])

  return <div className="text-xs text-gray-400">{error ? `TTS error: ${error}` : 'Voice output ready'}</div>
}