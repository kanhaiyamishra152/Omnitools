export async function synthesizeSpeech(text: string): Promise<Blob> {
  const res = await fetch('/api/tts', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  })
  if (!res.ok) throw new Error('TTS request failed')
  return res.blob()
}