import { useCallback, useState } from 'react'

interface ChatEngineProps {
  onSpeak: (text: string) => void
}

export default function ChatEngine({ onSpeak }: ChatEngineProps) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const send = useCallback(async (userText: string) => {
    if (!userText.trim()) return
    const next: Array<{ role: 'user' | 'assistant'; content: string }> = [...messages, { role: 'user', content: userText }]
    setMessages(() => next)
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next })
      })
      const data = await res.json()
      const reply = data.reply as string
      setMessages((m) => [...m, { role: 'assistant', content: reply }])
      onSpeak(reply)
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, I encountered an error.' }])
    } finally { setLoading(false) }
  }, [messages, onSpeak])

  return (
    <div className="space-y-4">
      <div className="max-h-64 overflow-y-auto space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`p-3 rounded border border-white/10 ${m.role === 'user' ? 'bg-cyan-500/10' : 'bg-white/5'}`}>
            <div className="text-xs uppercase tracking-wider text-cyan-300 mb-1">{m.role}</div>
            <div className="text-sm leading-relaxed">{m.content}</div>
          </div>
        ))}
      </div>
      <form
        className="flex gap-2"
        onSubmit={(e) => { e.preventDefault(); send(input); setInput('') }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-black/40 border border-cyan-400/30 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          placeholder="Type a message"
        />
        <button disabled={loading} className="px-4 py-2 rounded bg-cyan-500 text-black font-medium disabled:opacity-50">Send</button>
      </form>
    </div>
  )
}