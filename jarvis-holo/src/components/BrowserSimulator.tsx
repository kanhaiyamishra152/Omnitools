import { useEffect, useState } from 'react'

interface BrowserSimulatorProps {
  query: string | null
}

interface SearchResult { title: string; link: string; snippet: string }

export default function BrowserSimulator({ query }: BrowserSimulatorProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [status, setStatus] = useState<'idle' | 'searching' | 'parsing' | 'done'>('idle')

  useEffect(() => {
    let cancelled = false
    if (!query) return
    ;(async () => {
      setStatus('searching')
      const res = await fetch('/api/search?q=' + encodeURIComponent(query))
      const data = await res.json()
      if (cancelled) return
      setResults(data.results || [])
      setStatus('parsing')
      setTimeout(() => { if (!cancelled) setStatus('done') }, 800)
    })()
    return () => { cancelled = true }
  }, [query])

  return (
    <div className="space-y-3">
      <div className="text-xs text-cyan-300">Status: {status}</div>
      <div className="grid gap-3">
        {results.map((r, i) => (
          <div key={i} className="p-3 rounded border border-cyan-400/10 bg-black/40 hover:border-cyan-400/40 transition-all">
            <div className="text-cyan-300 font-medium">{r.title}</div>
            <div className="text-xs text-cyan-500">{r.link}</div>
            <div className="text-sm text-gray-300 mt-1">{r.snippet}</div>
          </div>
        ))}
        {results.length === 0 && <div className="text-sm text-gray-400">No results yet.</div>}
      </div>
    </div>
  )
}